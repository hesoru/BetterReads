import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Paper,
  Tooltip,
} from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import BookGalleryManager from '../components/Book/BookGalleryManager';
import { getSanitizedItem } from '../utils/sanitize';

import HeroBanner from '../components/common/HeroBanner';
import '../components/Book/BookPage.css';

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is a guest
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check if the user is a guest
    const currentUser = getSanitizedItem('user', {});
    setIsGuest(currentUser?.isGuest === true);
  }, []);

  // Fetch recommendations on mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (isGuest) {
        // Don't fetch personalized recommendations for guest users
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Get the current user from localStorage if available
        const currentUser = getSanitizedItem('user', {});
        const username = currentUser?.username || '';
        console.log("username: ", username);
        
        if (!username) {
          setError('Username not found');
          return;
        }
        
        // Use the recommendations endpoint
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        const url = `${backendUrl}/recommendations/${username}`;
        console.log('Fetching recommendations from:', url);
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch recommendations');
        const data = await res.json();
        
        console.log('Received data:', data);
        
        // Handle different response formats
        if (data && data.recommendations) {
          // Original recommendations format
          setRecommendations(data.recommendations.map(book => book._id));
        } else if (data && data.books) {
          // Popular books format
          setRecommendations(data.books.map(book => book._id || book.id));
        } else if (Array.isArray(data)) {
          // Direct array format
          setRecommendations(data.map(book => book._id || book.id || book));
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setError('Could not load personalized recommendations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [isGuest]);

  // Fetch popular books
  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        const res = await fetch(`${backendUrl}/books/popular`);
        if (!res.ok) throw new Error('Failed to fetch popular books');
        const data = await res.json();
        setPopularBooks(data.map(book => book._id));
      } catch (err) {
        console.error('Failed to fetch popular books:', err);
      }
    };
    fetchPopularBooks();
  }, []);

  return (
    <div style={styles.container}>
      <HeroBanner title="Get personalized book recommendations!" />

      <Container maxWidth="lg">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mr: 1 }}>
                  Recommended for You
                </Typography>
                <Tooltip 
                  title="Our AI-powered recommender system analyzes your ratings and preferences to suggest books you'll love. It uses collaborative filtering to find users with similar tastes and recommends books they enjoyed. The more you rate, the better your recommendations become!"
                  placement="top"
                  arrow
                >
                  <HelpOutline 
                    sx={{ 
                      fontSize: 20, 
                      color: 'text.secondary', 
                      cursor: 'help',
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }} 
                  />
                </Tooltip>
              </Box>
              {isGuest ? (
                <Typography>
                  Guest user: log in to see personalized recommendations.
                </Typography>
              ) : recommendations.length > 0 ? (
                <BookGalleryManager books={recommendations} limit={20} />
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Typography sx={{ fontWeight: 'bold' }}>No personalized recommendations available yet. Try rating some books!</Typography>
              )}
            </Paper>

            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Top-Rated Books
              </Typography>
              {popularBooks.length > 0 ? (
                <BookGalleryManager books={popularBooks} limit={20} />
              ) : (
                <Typography sx={{ fontWeight: 'bold' }}>Loading top-rated books...</Typography>
              )}
            </Paper>
          </>
        )}
      </Container>
    </div>
  );
};

const styles = {
  container: {
    padding: 0,
  },
};

export default RecommendationsPage;
