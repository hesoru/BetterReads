import express from 'express';
import Books from '../model/books.js';
import Reviews from '../model/reviews.js';
import Users from "../model/users.js";
import mongoose from "mongoose";
import axios from 'axios';
const router = express.Router();

// retrieve books via a generic search query
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        let query = {};

        if (q && q.trim() !== "") {
            // Search across title, author, and description fields
            query = {
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { author: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } }
                ]
            };
        }

        const books = await Books.find(query);
        console.log(books);
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: 'Search failed', details: err.message });
    }
});

router.get('/genre-search', async (req, res) => {
    try {
        const { q, genre, page, limit  } = req.query;

        const parsedPage = Math.max(parseInt(page, 10), 1);
        const parsedLimit = Math.min(Math.max(parseInt(limit, 10), 1), 50); // Max 50 per page
        const skip = (parsedPage - 1) * parsedLimit;


        const andConditions = [];

        if (q && q.trim() !== '') {
            andConditions.push({
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { author: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } }
                ]
            });
        }

        if (genre) {
            const genreList = Array.isArray(genre)
                ? genre
                : genre.split(',').map((g) => g.trim());

            if (genreList.length > 0) {
                andConditions.push({ genre: { $all: genreList } });
            }
        }

        // Final query
        const query = andConditions.length > 0 ? { $and: andConditions } : {};

        const [books, totalCount] = await Promise.all([
            Books.find(query).skip(skip).limit(parsedLimit),
            Books.countDocuments(query)
        ]);

        console.log("totalCount", totalCount);
        res.json({
            page: parsedPage,
            limit: parsedLimit,
            totalPages: Math.ceil(totalCount / parsedLimit),
            totalResults: totalCount,
            results: books
        });
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

// GET /books/popular - Get popular books sorted by average rating
router.get('/popular', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20; // Default to 20 books
        
        // Find books with at least some reviews and sort by average rating
        const popularBooks = await Books.find({ reviewCount: { $gt: 0 } })
            .sort({ averageRating: -1 }) // Sort by highest rating first
            .limit(limit);
                
        res.json(popularBooks);
    } catch (err) {
        console.error('Failed to fetch popular books:', err);
        res.status(500).json({ error: 'Failed to fetch popular books', details: err.message });
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
        const { username, rating, description } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'username is required' });
        }

        const updateFields = {};
        if (rating !== undefined) updateFields.rating = rating;
        if (description !== undefined) updateFields.description = description;

        const existingReview = !!(await Reviews.findOne({ bookId, userId: username }));

        if (existingReview) {
            // Update the existing review
            const updated = await Reviews.findOneAndUpdate(
                { bookId, userId: username },
                { ...updateFields, updatedAt: new Date() },
                { new: true }
            );
            
            // Update the recommender matrix
            try {
                await axios.post('http://localhost:5001/update-matrix');
                console.log('Recommender matrix updated after review update');
            } catch (updateError) {
                console.error('Failed to update recommender matrix:', updateError.message);
                // Don't fail the request if matrix update fails
            }
            
            return res.status(200).json(updated);
        }

        // Create a new review if none exists
        const newReview = new Reviews({
            bookId,
            userId: username,
            ...updateFields,
            createdAt: new Date(),
        });

        const savedReview = await newReview.save();

        const book = await Books.findById(bookId);
        if (!book) throw new Error('Book not found');

        const user = await Users.findOne({username});
        if (!user) throw new Error('User not found');

        //  Increment book review count
        book.reviewCount = (book.reviewCount || 0) + 1;
        await book.save();

        //  Add review to user if not already included
        user.reviews.push(savedReview._id);
        await user.save();
        
        // Update the recommender matrix
        try {
            await axios.post('http://localhost:5001/update-matrix');
            console.log('Recommender matrix updated after new review');
        } catch (updateError) {
            console.error('Failed to update recommender matrix:', updateError.message);
            // Don't fail the request if matrix update fails
        }
        
        res.status(201).json(savedReview);
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