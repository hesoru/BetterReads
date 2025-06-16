import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  publishYear: Number,
  image: String,
  description: String,
  genre: [String], 
  ISBN13: String,
  numberOfEditions: Number,
  averageRating: Number,
  ratingsCount: Number,
  reviewCount: Number
});

export default mongoose.model('Book', BookSchema);