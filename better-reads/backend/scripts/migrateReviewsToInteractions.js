// Script to migrate existing reviews to the new Interaction model
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from '../model/reviews.js';
import Interaction from '../model/interactions.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/betterreads')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function migrateReviewsToInteractions() {
  try {
    console.log('Starting migration of reviews to interactions...');
    
    // Get all reviews
    const reviews = await Review.find({}).exec();
    console.log(`Found ${reviews.length} reviews to migrate`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each review
    for (const review of reviews) {
      try {
        // Check if an interaction already exists for this user-book pair
        const existingInteraction = await Interaction.findOne({
          userId: review.userId,
          bookId: review.bookId,
          interactionType: 'review'
        }).exec();
        
        if (existingInteraction) {
          console.log(`Interaction already exists for user ${review.userId} and book ${review.bookId}`);
          continue;
        }
        
        // Create a new interaction from the review
        const newInteraction = new Interaction({
          userId: review.userId,
          bookId: review.bookId,
          rating: review.rating || 3, // Default to neutral if no rating
        });
        
        await newInteraction.save();
        successCount++;
      } catch (err) {
        console.error(`Error migrating review ${review._id}:`, err);
        errorCount++;
      }
    }
    
    console.log('Migration completed!');
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Failed migrations: ${errorCount}`);
    
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the migration
migrateReviewsToInteractions();
