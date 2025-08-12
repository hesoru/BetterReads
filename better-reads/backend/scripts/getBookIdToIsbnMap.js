import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Book from '../model/books.js';

// Load environment variables
dotenv.config();

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://mongodb:27017/betterreads';
console.log('Connecting to MongoDB with URI:', uri.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:***@'));

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connected for book ID to ISBN mapping');
    console.log('Connected to database:', mongoose.connection.db.databaseName);
    
    // List all collections
    return mongoose.connection.db.listCollections().toArray();
  })
  .then(collections => {
    console.log('\nAvailable collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    console.log();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

/**
 * Create a mapping of book IDs to ISBNs
 */
async function createBookIdToIsbnMap() {
  try {
    console.log('Retrieving books from database...');
    
    // Get all books
    console.log('Book model is looking for collection:', Book.collection.name);
    const books = await Book.find({}, '_id ISBN title author').exec();
    console.log(`Found ${books.length} books in the database`);
    
    if (books.length === 0) {
      console.log('No books found in database');
      return;
    }
    
    // Create the mapping
    const bookIdToIsbnMap = {};
    books.forEach(book => {
      bookIdToIsbnMap[book._id.toString()] = {
        ISBN: book.ISBN,
        title: book.title,
        author: book.author
      };
    });
    
    // Write to file
    const outputPath = path.join(__dirname, '../data/bookIdToIsbnMap.json');
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(bookIdToIsbnMap, null, 2));
    
    console.log(`Book ID to ISBN map created with ${books.length} books`);
    console.log(`File saved to: ${outputPath}`);
    
    // Also print the map to console
    console.log('\nBook ID to ISBN Map:');
    console.log(JSON.stringify(bookIdToIsbnMap, null, 2));
    
  } catch (error) {
    console.error('Error creating book ID to ISBN map:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}

// Run the script
createBookIdToIsbnMap();
