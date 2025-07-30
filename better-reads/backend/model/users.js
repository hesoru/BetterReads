
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  favoriteGenres: {
    type: [String],
    required: true,
  },
  join_time: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      required: true,
    }
  ],
  username: {
    type: String,
    required: true,
    unique: true,
  },
  wantToRead: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    }
  ],
  finished: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    }
  ],
  avatarUrl: {
    type: String,
    required: true,
    default: '../../src/images/icons/User_Profile_Image_NoLogo.png'
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema, 'users');