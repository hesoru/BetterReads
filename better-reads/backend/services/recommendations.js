import axios from 'axios';
import User from '../model/users.js';
import Book from '../model/books.js';
import Review from '../model/reviews.js';
import { getFromRedis, storeInRedis } from './redisClient.js';

/**
 * Get personalized book recommendations for a user
 * @param {string} username_string - The username of the user to get recommendations for
 * @returns {Promise<Array>} - Array of 20 recommended book objects
 */
async function getRecommendations(username_string) {
  try {
    const user = await User.findOne({ username: username_string }).exec();
    if (!user) {
      throw new Error(`User with username ${username_string} not found`);
    }

    // check if the matrix exists in Redis
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
        username: username_string,
      });
      apiRecommendations = response.data.recommendations || [];
      console.log(`Received ${apiRecommendations.length} recommendations from API`);
    } catch (error) {
      console.error("Recommendation API failed:", error.message);
      console.error("Error details:", error.response?.data || error.message);
    }

    // Filter out books the user has already interacted with
    const interactedBookIds = await getInteractedBookIds(user.username);
    const filteredApiRecs = apiRecommendations.filter(
      bookId => !interactedBookIds.includes(bookId)
    );

    // If we have 20 API recommendations, use those
    if (filteredApiRecs.length >= 20) {
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

/**
 * Find the book IDs of the books that the user has reviewed already
 * @param {String} username_string - Username
 * @returns {Promise<Array>} - Array of book IDs
 */
async function getInteractedBookIds(username_string) {
  // userId in the Review model is the username string
  const reviews = await Review.find({ userId: username_string }).exec();
  console.log(reviews);
  return reviews.map(review => review.bookId);
}

/**
 * Combine multiple recommendation strategies
 * @param {Array} favoriteGenres - User's favorite genres
 * @param {Array} excludeIds - Book IDs to exclude
 * @param {Array} apiRecs - Recommendations from the API
 * @returns {Promise<Array>} - Combined (RECOMMENDATIONS_LENGTH) book recommendations
 */
async function getCombinedRecommendations(favoriteGenres, excludeIds, apiRecs = []) {
  
  const genreRecs = await getGenreBasedRecommendations(favoriteGenres, excludeIds);
  
  const popularRecs = await getPopularityBasedRecommendations(excludeIds);
  
  // Combine API recommendations, genre-based recommendations, and popularity-based recommendations
  // API recommendations get highest priority, then genre, then popular
  const RECOMMENDATIONS_LENGTH = 20;
  const allRecommendationIds = [
    ...apiRecs,                                                 // API recommendations (highest priority)
    ...genreRecs.slice(0, 10),                                  // Top 10 genre recommendations
    ...popularRecs.slice(0, 25-apiRecs.length-genreRecs.length) // Remaining popular recommendations
  ];
  
  // Remove duplicates
  const uniqueRecommendationIds = [...new Set(allRecommendationIds)];
  
  const books = await Book.find({
    _id: { $in: uniqueRecommendationIds }
  }).limit(RECOMMENDATIONS_LENGTH).exec();
  
  return books;
}

/**
 * Get recommendations based on user's favorite genres
 * @param {Array} favoriteGenres - User's favorite genres
 * @param {Array} excludeIds - Book IDs to exclude, that user has already reviewed
 * @returns {Promise<Array>} - Array of (RECOMMENDATIONS_LENGTH) book objects
 */
async function getGenreBasedRecommendations(favoriteGenres, excludeIds) {

  // if no favourite genres, return empty array
  if (!favoriteGenres || favoriteGenres.length === 0) {
    return [];
  }
  
  const MIN_RATINGS = 10000; // books must have more than 10,000 ratings (many popular books have over 100,000)
  const MIN_REVIEWS = 1000;  // books must have more than 1,000 reviews (many popular books have over 10,000 reviews)
  const MIN_AVG_RATING = 4;  // books must have an average rating of 4 or higher
  const RECOMMENDATIONS_LENGTH = 15;

  // Find books with matching user's favorite genres with highest ratings
  const genreBooks = await Book.find({
    genre: { $in: favoriteGenres },
    _id: { $nin: excludeIds },
    ratingsCount: { $gte: MIN_RATINGS }, 
    reviewCount: { $gte: MIN_REVIEWS }, 
    averageRating: { $gte: MIN_AVG_RATING }    
  })
  .sort({ averageRating: -1, ratingsCount: -1 })
  .limit(RECOMMENDATIONS_LENGTH)
  .exec();
  
  return genreBooks;
}

/**
 * Get recommendations based on most popular books: highest average rating with a minimum amount of ratings and reviews
 * @param {Array} excludeIds - Book IDs to exclude, that user has already reviewed
 * @returns {Promise<Array>} - Array of (RECOMMENDATIONS_LENGTH) book objects
 */
async function getPopularityBasedRecommendations(excludeIds) {
  try {
    // Try to get popular books from Redis first
    const REDIS_KEY = 'popular_books';
    let popularBooks = [];
    popularBooks = await getFromRedis(REDIS_KEY);
    
    // If not in Redis, calculate popular books and store in Redis
    if (!popularBooks) {
      console.log('Calculating popular books from reviews...');
      
      const MIN_RATINGS = 100000; // books must have more than 100,000 ratings (many popular books have over 100,000 ratings)
      const MIN_REVIEWS = 10000;  // books must have more than 10,000 reviews (many popular books have over 10,000 reviews)
      const MIN_AVG_RATING = 4;   // books must have an average rating of 4 or higher
      const RECOMMENDATIONS_LENGTH = 25;

      // Get most popular books: highest average rating with a minimum amount of ratings and reviews
      popularBooks = await Book.find({
        _id: { $nin: excludeIds },
        ratingsCount: { $gte: MIN_RATINGS }, 
        reviewCount: { $gte: MIN_REVIEWS }, 
        averageRating: { $gte: MIN_AVG_RATING }    
      })
      .sort({ averageRating: -1, ratingsCount: -1 })
      .limit(RECOMMENDATIONS_LENGTH)
      .exec();
      
      // Store in Redis for future use 
      const REDIS_POPULAR_BOOKS_EXPIRE_TIME = 86400; // (expires in 24 hours since popularity changes less frequently)
      await storeInRedis(REDIS_KEY, popularBooks, REDIS_POPULAR_BOOKS_EXPIRE_TIME);
      console.log('Popular books stored in Redis');
    } else {
      console.log('Using popular books from Redis cache');
    }
    
    // If still no results, get books with highest average rating > 4
    if (popularBooks.length === 0) {
      const topBooks = await Book.find({
        _id: { $nin: excludeIds },
        averageRating: { $gte: MIN_AVG_RATING }
      })
      .sort({ averageRating: -1, ratingsCount: -1 })
      .limit(RECOMMENDATIONS_LENGTH)
      .exec();
      
      return topBooks || [];
    }
    
    return popularBooks;
  } catch (error) {
    console.error('Error in popularity-based recommendations:', error);
    // Last resort fallback - just get any books with highest average rating
    try {
      const RECOMMENDATIONS_LENGTH = 25;
      const lastResortBooks = await Book.find({})
        .sort({ averageRating: -1 })
        .limit(RECOMMENDATIONS_LENGTH)
        .exec();
      
      return lastResortBooks || [];
    } catch (fallbackError) {
      console.error('Last resort fallback also failed:', fallbackError);
      return [];
    }
  }
}

export { getRecommendations, getPopularityBasedRecommendations };