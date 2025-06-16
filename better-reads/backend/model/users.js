
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
  },
  wishList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    }
  ],
  avatarUrl: {
    type: String,
    required: true,
    //TODO: change default link
    default: 'https://ui-avatars.com/api/?name=User&background=random'
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema, 'users');