import express from 'express';
import Books from '../model/books.js';
const router = express.Router();

//TODO: add pagination?
// retrives all books in database
router.get('/', async (req, res) => {
    const categories = await Books.find();
    res.json(categories);
});

export default router;