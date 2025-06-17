import express from 'express';
import Books from '../model/books.js';
import Reviews from '../model/reviews.js';
import Users from "../model/users.js";
const router = express.Router();

// retrieve a book via a query on search
router.get('/search', async (req, res) => {
    try {
        const { title, author, genre } = req.query;
        const query = {};

        if (title) query.title = new RegExp(title, 'i');
        if (author) query.author = new RegExp(author, 'i');
        if (genre) query.genre = genre; // exact match, or use $in for multiple

        const books = await Books.find(query);
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: 'Search failed', details: err.message });
    }
});

// potential flexible route for querying
// router.get('/search', async (req, res) => {
//     try {
//         const query = {};
//
//         // Loop through each query parameter and apply logic
//         for (const [key, value] of Object.entries(req.query)) {
//             // For fields like title or author, use case-insensitive regex
//             if (['title', 'author', 'description'].includes(key)) {
//                 query[key] = new RegExp(value, 'i');
//             }
//             // For genre, match if any item in array matches (exact or partial)
//             else if (key === 'genre') {
//                 query.genre = { $in: [new RegExp(value, 'i')] }; // case-insensitive partial match
//             }
//             // For numeric fields like publishYear or ratingsCount
//             else if (!isNaN(value)) {
//                 query[key] = Number(value);
//             }
//             // Otherwise, use exact match
//             else {
//                 query[key] = value;
//             }
//         }
//
//         const books = await Books.find(query);
//         res.json(books);
//     } catch (err) {
//         res.status(500).json({ error: 'Search failed', details: err.message });
//     }
// });

// GET books by multiple genres /books/genres?genres=Romance,Fiction&sort=desc
router.get('/genres', async (req, res) => {
    try {
        const { genres, sort = 'desc' } = req.query;

        if (!genres) {
            return res.status(400).json({ error: 'Genres query parameter is required' });
        }

        const genreArray = genres.split(',').map(g => g.trim());

        const books = await Books.find({ genre: { $in: genreArray } })
            .sort({ averageRating: sort === 'asc' ? 1 : -1 });

        res.json(books);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch books by genres', details: err.message });
    }
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

// retrieve a book by bookId
router.get('/:id', async (req, res) => {
    try {
        const book = await Books.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch book', details: err.message });
    }
});




//TODO: add pagination?
// retrieves all books in database
router.get('/', async (req, res) => {
    const categories = await Books.find();
    res.json(categories);
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

// add book to wishlist
router.post('/:bookId/wishlist', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'userId is required' });

        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            { $addToSet: { wishList: req.params.bookId } },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.json(updatedUser.wishList);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add to wishlist', details: err.message });
    }
});

router.delete('/:bookId/wishlist', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'userId is required' });

        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            { $pull: { wishList: req.params.bookId } },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.json(updatedUser.wishList);
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove from wishlist', details: err.message });
    }
});


export default router;