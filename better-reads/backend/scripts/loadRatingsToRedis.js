import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getFromRedis, storeInRedis } from '../services/redisClient.js';

// Load environment variables
dotenv.config();

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadRatingsToRedis() {
  try {
    console.log('Loading ratings data from JSON file to Redis...');
    
    // Path to the ratings JSON file
    const ratingsFilePath = path.join(__dirname, '../data/ratings_books.json');
    
    // Check if file exists
    if (!fs.existsSync(ratingsFilePath)) {
      console.error(`File not found: ${ratingsFilePath}`);
      process.exit(1);
    }
    
    // Read and parse the JSON file
    const fileContent = fs.readFileSync(ratingsFilePath, 'utf8');
    const ratingsData = JSON.parse(fileContent);
    
    console.log(`Read ${Object.keys(ratingsData).length} ratings entries from file`);
    
    // Transform data to the format expected by the recommendation service
    // Expected format: [{userId: string, bookId: string, rating: number}, ...]
    const interactions = [];
    
    // Process the data based on the described structure
    // index is bookId, user_id is userId, and rating is rating
    for (const bookId in ratingsData) {
      const bookRatings = ratingsData[bookId];
      for (const userId in bookRatings) {
        const rating = bookRatings[userId];
        interactions.push({
          userId: userId,
          bookId: bookId,
          rating: parseInt(rating, 10) || 3 // Default to 3 if rating is not a valid number
        });
      }
    }
    
    console.log(`Transformed data into ${interactions.length} interaction records`);
    
    // Store the interactions in Redis
    const REDIS_KEY = 'user_item_matrix';
    const result = await storeInRedis(REDIS_KEY, interactions, 3600); // Cache for 1 hour
    
    if (result) {
      console.log(`Successfully stored user-item matrix in Redis with key: ${REDIS_KEY}`);
      console.log(`Cache will expire in 1 hour`);
    } else {
      console.error('Failed to store data in Redis');
    }
    
    // Also store the popular books based on average ratings
    const bookRatings = {};
    
    // Calculate average rating for each book
    interactions.forEach(interaction => {
      if (!bookRatings[interaction.bookId]) {
        bookRatings[interaction.bookId] = {
          totalRating: 0,
          count: 0
        };
      }
      
      bookRatings[interaction.bookId].totalRating += interaction.rating;
      bookRatings[interaction.bookId].count += 1;
    });
    
    // Calculate average and sort books by popularity
    const popularBooks = Object.keys(bookRatings)
      .map(bookId => ({
        bookId,
        averageRating: bookRatings[bookId].totalRating / bookRatings[bookId].count,
        ratingCount: bookRatings[bookId].count
      }))
      .sort((a, b) => {
        // Sort by average rating (descending)
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }
        // If average ratings are equal, sort by number of ratings (descending)
        return b.ratingCount - a.ratingCount;
      })
      .slice(0, 50) // Get top 50 books
      .map(book => book.bookId);
    
    // Store popular books in Redis
    const POPULAR_BOOKS_KEY = 'popular_books';
    const popularResult = await storeInRedis(POPULAR_BOOKS_KEY, popularBooks, 21600); // Cache for 6 hours
    
    if (popularResult) {
      console.log(`Successfully stored popular books in Redis with key: ${POPULAR_BOOKS_KEY}`);
      console.log(`Cache will expire in 6 hours`);
    } else {
      console.error('Failed to store popular books in Redis');
    }
    
  } catch (error) {
    console.error('Error loading ratings to Redis:', error);
  }

  // Close Redis connection
  await redisClient.quit();
}

// Run the loading function
loadRatingsToRedis()
  .catch(err => {
    console.error('Failed to load ratings to Redis:', err);
    process.exit(1);
  });
