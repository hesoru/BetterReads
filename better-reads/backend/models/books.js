const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  publishYear: Number,
  image: String,
  description: String,
  genre: [String], 
  ISBN13: String,
  numberOfEditions: Number,
  averageRating: Double,
  ratingsCount: Number,
  reviewCount: Number
});

module.exports = mongoose.model('Book', BookSchema);