
import express from 'express';
import Reviews from '../model/reviews.js';
import Users from "../model/users.js";
import mongoose from "mongoose";
import axios from 'axios';
const router = express.Router();

// PUT /reviews/:reviewId - Edit a user's review
router.put('/:reviewId', async (req, res) => {
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
router.delete('/:reviewId', async (req, res) => {
    try {
        const { reviewId } = req.params;
        const deleted = await Reviews.findByIdAndDelete(reviewId);

        if (!deleted) return res.status(404).json({ error: 'Review not found' });

        // Update the recommender matrix
        try {
            await axios.post('http://localhost:5001/update-matrix');
            console.log('Recommender matrix updated after review deletion');
        } catch (updateError) {
            console.error('Failed to update recommender matrix:', updateError.message);
            // Don't fail the request if matrix update fails
        }

        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete review', details: err.message });
    }
});

// GET /reviews/user-review?bookId=...&userId=...
// Get the single review on a given book (bookID) left by current user (pass the username)
router.get('/user-review', async (req, res) => {
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

export default router;

