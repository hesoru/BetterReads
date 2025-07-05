import express from 'express';
import { getRecommendations } from '../services/recommendations.js';

const router = express.Router();

/**
 * @route   GET /api/recommend/:userId
 * @desc    Get book recommendations for a specific user
 * @access  Public
 */
router.get('/:userId', async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const books = await getRecommendations(req.params.userId);
    
    if (!books || books.length === 0) {
      return res.json({ 
        books: [],
        message: 'No recommendations found. Try rating more books to get personalized recommendations.'
      });
    }
    
    res.json({ 
      books,
      count: books.length,
      message: 'Recommendations retrieved successfully'
    });
  } catch (err) {
    console.error('Error in recommendations route:', err);
    res.status(500).json({ 
      error: err.message,
      message: 'Failed to retrieve recommendations. Please try again later.'
    });
  }
});

export default router;
