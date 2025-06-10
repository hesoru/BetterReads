const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userId: { type: string, required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  title: String,
  date: { type: Date, default: Date.now },
  rating: { type: Number, min: 1, max: 5 },
  description: String
});

module.exports = mongoose.model('Review', ReviewSchema);