import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from '../model/reviews.js';
import Users from '../model/users.js';
import { getRecommendations } from '../services/recommendations.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const uri = process.env.MONGODB_URI || 'mongodb+srv://rex015:iDPU4rvt5HjtDrW1@sandbox.bcebozm.mongodb.net/bookdb?retryWrites=true&w=majority&appName=Sandbox';
console.log('Connecting to MongoDB with URI:', uri.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:***@'));

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connected for testing recommendations');
    return testRecommendations();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function testRecommendations() {
  try {
    // Find a user with reviews
    const review = await Review.findOne();
    
    if (!review) {
      console.log('No reviews found in database. Cannot test recommendations.');
      return;
    }
    
    const username = review.userId;
    console.log(`Testing recommendations for user: ${username}`);

    let user = await Users.findOne({ username: username });
    if (!user) {
      console.log('User not found. Cannot test recommendations.');
      return;
    }

    // In your system, the userId for recommendations should be the username
    // NOT the MongoDB _id, since your recommender expects usernames
    const userId = username;
    
    // Get recommendations using the service function
    console.log('\n1. Testing recommendations service function:');
    console.time('Service function time');
    const serviceRecommendations = await getRecommendations(userId);
    console.timeEnd('Service function time');
    console.log(`Received ${serviceRecommendations.length} recommendations from service function`);
    
    if (serviceRecommendations.length > 0) {
      console.log('Sample recommendations:', serviceRecommendations.slice(0, 3));
    }
    
    // Test the API endpoint directly
    console.log('\n2. Testing recommendations API endpoint:');
    try {
      console.time('API endpoint time');
      const response = await axios.get(`http://localhost:3000/recommendations/${userId}`);
      console.timeEnd('API endpoint time');
      
      console.log('API Response:', response.data);
    } catch (apiError) {
      console.error('API endpoint error:', apiError.message);
      if (apiError.response) {
        console.error('API response status:', apiError.response.status);
        console.error('API response data:', apiError.response.data);
      }
    }
    
    // Run the test again to check if Redis caching is working
    console.log('\n3. Testing recommendations service function again (should be faster with Redis cache):');
    console.time('Service function time (second call)');
    const cachedRecommendations = await getRecommendations(userId);
    console.timeEnd('Service function time (second call)');
    console.log(`Received ${cachedRecommendations.length} recommendations from cached service function`);
    
  } catch (error) {
    console.error('Error testing recommendations:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}
