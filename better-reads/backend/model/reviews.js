// models/Review.js (or Note.js)
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  userId: {       // username string, not user ObjectId
    type: String,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  date: {
    type: Date,
  },
}, { timestamps: true });

// Limits each user to one review per book
ReviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Review', ReviewSchema, 'reviews');