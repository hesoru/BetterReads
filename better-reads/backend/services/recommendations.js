import axios from 'axios';
import User from '../model/users.js';
import Book from '../model/books.js';
import Review from '../model/reviews.js';
import { getFromRedis, storeInRedis } from './redisClient.js';

/**
 * Get personalized book recommendations for a user
 * @param {string} fn_username - The username of the user to get recommendations for
 * @returns {Promise<Array>} - Array of recommended book objects
 */
async function getRecommendations(fn_username) {
  try {
    // Look up user by username
    const user = await User.findOne({ username: fn_username }).exec();
    
    if (!user) {
      throw new Error(`User with username ${fn_username} not found`);
    }

    // For backward compatibility, we'll still check if the matrix exists in Redis
    const REDIS_KEY = 'user_item_matrix';
    const matrixExists = await getFromRedis(REDIS_KEY);
    
    if (!matrixExists) {
      console.log('User-item matrix not found in Redis. The recommender service will initialize it.');
    } else {
      console.log('User-item matrix exists in Redis and is managed by the recommender service.');
    }

    // Try to get recommendations from the API
    let apiRecommendations = [];
    try {
      const response = await axios.post('http://recommender:5001/recommend', {
        username: fn_username,
        interactions: [] // Add empty interactions array to satisfy API requirement
      });
      
      apiRecommendations = response.data.recommendations || [];
      console.log(`Received ${apiRecommendations.length} recommendations from API`);
    } catch (error) {
      console.error("Recommendation API failed:", error.message);
      console.error("Error details:", error.response?.data || error.message);
    }

    const interactedBookIds = await getInteractedBookIds(user._id);

    // Filter out books the user has already interacted with
    const filteredApiRecs = apiRecommendations.filter(
      bookId => !interactedBookIds.includes(bookId)
    );

    // If we have enough API recommendations, use those
    if (filteredApiRecs.length >= 10) {
      const books = await Book.find({ _id: { $in: filteredApiRecs } }).limit(20).exec();
      return books;
    }

    // Otherwise, combine multiple recommendation strategies
    const combinedRecommendations = await getCombinedRecommendations(
      user.favoriteGenres, 
      interactedBookIds,
      filteredApiRecs
    );

    return combinedRecommendations;
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    // Return popularity-based recommendations in case of any error
    return getPopularityBasedRecommendations([]);
  }
}

async function getInteractedBookIds(userId) {
  const reviews = await Review.find({ userId }).exec();
  console.log(reviews);
  return reviews.map(review => review.bookId);
}

/**
 * Combine multiple recommendation strategies
 * @param {string} userId - User ID
 * @param {Array} favoriteGenres - User's favorite genres
 * @param {Array} excludeIds - Book IDs to exclude
 * @param {Array} apiRecs - Recommendations from the API
 * @returns {Promise<Array>} - Combined book recommendations
 */
async function getCombinedRecommendations(favoriteGenres, excludeIds, apiRecs = []) {
  // Get genre-based recommendations
  const genreRecs = await getGenreBasedRecommendations(favoriteGenres, excludeIds);
  
  // Get popular books as fallback
  const popularRecs = await getPopularityBasedRecommendations(excludeIds);
  
  // Combine all recommendation sources with weights
  // API recommendations get highest priority, then genre, then popular
  const allRecommendationIds = [
    ...apiRecs,                // API recommendations (highest priority)
    ...genreRecs.slice(0, 5),  // Top 5 genre recommendations
    ...popularRecs.slice(0, 5)  // Top 5 popular recommendations as fallback
  ];
  
  // Remove duplicates
  const uniqueRecommendationIds = [...new Set(allRecommendationIds)];
  
  // Fetch full book details
  const books = await Book.find({
    _id: { $in: uniqueRecommendationIds }
  }).limit(20).exec();
  
  return books;
}

/**
 * Get recommendations based on user's favorite genres
 * @param {Array} favoriteGenres - User's favorite genres
 * @param {Array} excludeIds - Book IDs to exclude
 * @returns {Promise<Array>} - Array of book IDs
 */
async function getGenreBasedRecommendations(favoriteGenres, excludeIds) {
  if (!favoriteGenres || favoriteGenres.length === 0) {
    return [];
  }
  
  // Find books matching user's favorite genres with high ratings
  const genreBooks = await Book.find({
    genre: { $in: favoriteGenres },
    _id: { $nin: excludeIds },
    averageRating: { $gte: 4 }
  })
  .sort({ averageRating: -1, ratingsCount: -1 })
  .limit(10)
  .exec();
  
  return genreBooks.map(book => book._id.toString());
}

/**
 * Get fallback recommendations based on popular books
 * @param {Array} excludeIds - Book IDs to exclude
 * @returns {Promise<Array>} - Array of book objects
 */
async function getPopularityBasedRecommendations(excludeIds) {
  try {
    // Try to get popular books from Redis first
    const REDIS_KEY = 'popular_books';
    let topBooks = await getFromRedis(REDIS_KEY);
    
    // If not in Redis, calculate popular books and store in Redis
    if (!topBooks) {
      console.log('Calculating popular books from reviews...');
      
      // Get top-rated books from reviews
      topBooks = await Review.aggregate([
        {
          $group: {
            _id: '$bookId',
            avgRating: { $avg: '$rating' },
            count: { $sum: 1 }
          }
        },
        { $match: { avgRating: { $gte: 4 }, count: { $gte: 2 } } },
        { $sort: { count: -1, avgRating: -1 } },
        { $limit: 10 }
      ]);
      
      // Store in Redis for future use (expires in 24 hours since popularity changes less frequently)
      await storeInRedis(REDIS_KEY, topBooks, 86400);
      console.log('Popular books stored in Redis');
    } else {
      console.log('Using popular books from Redis cache');
    }
    
    // If still no results, get books with highest average rating
    if (topBooks.length === 0) {
      const popularBooks = await Book.find({
        ratingsCount: { $gte: 10 },
        averageRating: { $gte: 4 }
      })
      .sort({ ratingsCount: -1, averageRating: -1 })
      .limit(10)
      .exec();
      
      return popularBooks.map(book => book._id.toString());
    }
    
    const filtered = topBooks
      .map(b => b._id.toString())
      .filter(bookId => !excludeIds.includes(bookId));
    
    return filtered;
  } catch (error) {
    console.error('Error in fallback recommendations:', error);
    // Last resort fallback - just get any books
    const lastResortBooks = await Book.find({})
      .sort({ averageRating: -1 })
      .limit(10)
      .exec();
    
    return lastResortBooks.map(book => book._id.toString());
  }
}

export { getRecommendations };