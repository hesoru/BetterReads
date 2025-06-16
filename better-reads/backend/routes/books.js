import express from 'express';
import Books from '../model/books.js';
import Reviews from '../model/reviews.js';
const router = express.Router();

//TODO: add pagination?
// retrives all books in database
router.get('/', async (req, res) => {
    const categories = await Books.find();
    res.json(categories);
});

// GET /books/:id/reviews - Get all reviews for a book
router.get('/:id/reviews', async (req, res) => {
    try {
        const { id: bookId } = req.params;
        const reviews = await Reviews.find({ bookId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews', details: err.message });
    }
});

// POST /books/:id/reviews - Create or update a review for a book
router.post('/:id/reviews', async (req, res) => {
    try {
        const { id: bookId } = req.params;
        const { userId, rating, comment } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        const updateFields = {};
        if (rating !== undefined) updateFields.rating = rating;
        if (comment !== undefined) updateFields.comment = comment;

        const existingReview = await Reviews.findOne({ bookId, userId });

        if (existingReview) {
            // Update the existing review
            const updated = await Reviews.findOneAndUpdate(
                { bookId, userId },
                { ...updateFields, updatedAt: new Date() },
                { new: true }
            );
            return res.status(200).json(updated);
        }

        // Create a new review if none exists
        const review = new Reviews({
            bookId,
            userId,
            ...updateFields,
            createdAt: new Date(),
        });

        const saved = await review.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create or update review', details: err.message });
    }
});

export default router;