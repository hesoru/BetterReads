// models/Book.js
import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  averageRating: {
    type: Number, // Mongoose supports both integer and float under Number
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  ISBN: {
    type: String,
    required: true,
    unique: true,
  },
  numberOfEditions: {
    type: Number,
    required: true,
  },
  publishYear: {
    type: Number,
    required: true,
  },
  ratingsCount: {
    type: Number,
    required: true,
  },
  reviewCount: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Book', BookSchema, 'books');