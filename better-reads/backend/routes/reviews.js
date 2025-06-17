
import express from 'express';
import Reviews from '../model/reviews.js';
import Users from "../model/users.js";
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

        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete review', details: err.message });
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

