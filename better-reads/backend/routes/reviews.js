
import express from 'express';
import Reviews from '../model/reviews.js';
import Users from "../model/users.js";
import Books from "../model/books.js";
import mongoose from "mongoose";
import axios from 'axios';
import { validateRequest, reviewValidationRules, paramValidation, queryValidation } from '../middleware/validators.js';
const router = express.Router();

// PUT /reviews/:reviewId - Edit a user's review
router.put('/:reviewId', [paramValidation.reviewId, ...reviewValidationRules.update], validateRequest, async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, description } = req.body;

        const updated = await Reviews.findByIdAndUpdate(
            reviewId,
            { rating, description, updatedAt: new Date() },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'Review not found' });

        // Update the recommender matrix
        try {
            await axios.post('http://localhost:5001/update-matrix');
            console.log('Recommender matrix updated after review edit');
        } catch (updateError) {
            console.error('Failed to update recommender matrix:', updateError.message);
            // Don't fail the request if matrix update fails
        }

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update review', details: err.message });
    }
});

// DELETE /reviews/:reviewId - Delete a user's review
router.delete('/:reviewId', paramValidation.reviewId, validateRequest, async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Reviews.findByIdAndDelete(reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        // Update the recommender matrix
        try {
            await axios.post('http://localhost:5001/update-matrix');
            console.log('Recommender matrix updated after review deletion');
        } catch (updateError) {
            console.error('Failed to update recommender matrix:', updateError.message);
            // Don't fail the request if matrix update fails
        }

        // Proceed to sync: decrement book review count and remove review from user
        const book = await Books.findById(review.bookId);
        const user = await Users.findOne({ username: review.userId }); // or use user _id if stored

        if (book && typeof book.reviewCount === 'number' && book.reviewCount > 0) {
            book.reviewCount -= 1;
            await book.save();
        }

        if (user && Array.isArray(user.reviews)) {
            user.reviews = user.reviews.filter(id => !id.equals(review._id));
            await user.save();
        }

        res.json({ message: 'Review deleted and references synced.' });

    } catch (err) {
        res.status(500).json({ error: 'Failed to delete review', details: err.message });
    }
});

// GET /reviews/user-review?bookId=...&userId=...
// Get the single review on a given book (bookID) left by current user (pass the username)
router.get('/user-review', queryValidation.userReview, validateRequest, async (req, res) => {
    const { bookId, userId } = req.query;

    if (!bookId || !userId) {
        return res.status(400).json({ error: 'Both bookId and userId are required' });
    }

    try {
        const query = {
            $and: [
                { bookId: new mongoose.Types.ObjectId(bookId) },
                { userId }
            ]
        };

        const review = await Reviews.findOne(query);

        if (!review) {
            return res.status(200).json(null);
        }

        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve review', details: err.message });
    }
});


// GET /reviews/user/:userId - Get all reviews by a specific user
router.get('/user/:username', async (req, res) => {
    try {
        const reviews = await Reviews.find({ userId: req.params.username });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user reviews', details: err.message });
    }
});

router.patch('/update-review-couunt/:reviewId/:userId/:action', async (req, res) => {
    try {
        const { reviewId, userId, action } = req.params;

        if (!['add', 'delete'].includes(action)) {
            return res.status(400).json({ error: 'Action must be "add" or "delete"' });
        }

        if (!mongoose.Types.ObjectId.isValid(reviewId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid reviewId or userId' });
        }

        const review = await Reviews.findById(reviewId);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        const book = await Books.findById(review.bookId);
        if (!book) return res.status(404).json({ error: 'Book not found' });

        const user = await Users.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const reviewObjId = new mongoose.Types.ObjectId(reviewId);

        // Handle add or delete
        if (action === 'add') {
            if (typeof book.reviewCount !== 'number') book.reviewCount = 0;
            book.reviewCount += 1;

            if (!user.reviews.some(id => id.equals(reviewObjId))) {
                user.reviews.push(reviewObjId);
            }

            await book.save();
            await user.save();

            return res.json({
                message: 'Review added: review count incremented and review added to user.',
                bookReviewCount: book.reviewCount,
                userReviewCount: user.reviews.length
            });

        } else if (action === 'delete') {
            if (typeof book.reviewCount === 'number' && book.reviewCount > 0) {
                book.reviewCount -= 1;
            }

            user.reviews = user.reviews.filter(id => !id.equals(reviewObjId));

            await book.save();
            await user.save();

            return res.json({
                message: 'Review deleted: review count decremented and review removed from user.',
                bookReviewCount: book.reviewCount,
                userReviewCount: user.reviews.length
            });
        }

    } catch (err) {
        res.status(500).json({
            error: 'Failed to sync review and user data',
            details: err.message
        });
    }
});

export default router;

