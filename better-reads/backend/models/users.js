const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  favoriteGenres: [String],
  join_time: { type: Date, default: Date.now },
  wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

module.exports = mongoose.model('User', UserSchema);