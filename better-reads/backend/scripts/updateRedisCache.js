import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from '../model/reviews.js';
import { storeInRedis } from '../services/redisClient.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/betterreads')
  .then(() => console.log('MongoDB connected for Redis cache update'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

/**
 * Update the user-item matrix in Redis
 */
async function updateUserItemMatrix() {
  try {
    console.log('Building user-item matrix from database...');
    const allReviews = await Review.find({}).exec();
    
    if (allReviews.length === 0) {
      console.log('No reviews found in database');
      return;
    }
    
    // Convert reviews to interaction format
    const allInteractions = allReviews.map(review => ({
      userId: review.userId.toString(),
      bookId: review.bookId.toString(),
      rating: review.rating || 3 // Default to neutral if no rating
    }));
    
    // Store in Redis for future use (expires in 1 hour)
    const success = await storeInRedis('user_item_matrix', allInteractions, 3600);
    
    if (success) {
      console.log(`User-item matrix with ${allInteractions.length} interactions stored in Redis`);
    } else {
      console.error('Failed to store user-item matrix in Redis');
    }
  } catch (error) {
    console.error('Error updating user-item matrix:', error);
  }
}

/**
 * Update popular books in Redis
 */
async function updatePopularBooks() {
  try {
    console.log('Calculating popular books from reviews...');
    
    // Get top-rated books from reviews
    const topBooks = await Review.aggregate([
      {
        $group: {
          _id: '$bookId',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      },
      { $match: { avgRating: { $gte: 4 }, count: { $gte: 2 } } },
      { $sort: { count: -1, avgRating: -1 } },
      { $limit: 15 }
    ]);
    
    if (topBooks.length === 0) {
      console.log('No popular books found');
      return;
    }
    
    // Store in Redis for future use (expires in 6 hours)
    const success = await storeInRedis('popular_books', topBooks, 21600);
    
    if (success) {
      console.log(`${topBooks.length} popular books stored in Redis`);
    } else {
      console.error('Failed to store popular books in Redis');
    }
  } catch (error) {
    console.error('Error updating popular books:', error);
  }
}

/**
 * Main function to update all Redis caches
 */
async function updateAllCaches() {
  try {
    await updateUserItemMatrix();
    await updatePopularBooks();
    console.log('All Redis caches updated successfully');
  } catch (error) {
    console.error('Error updating Redis caches:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}

// Run the update
updateAllCaches();
