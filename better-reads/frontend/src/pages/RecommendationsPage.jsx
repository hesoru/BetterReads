import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';
import BookGalleryManager from '../components/Book/BookGalleryManager';
import BetterReadsLogo from '../images/icons/BetterReadsLogo.svg';
import BackgroundImage from '../images/background.svg';
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
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
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
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = currentUser?.username || '';
        console.log("userId: ", userId);
        
        if (!userId) {
          setError('User ID not found');
          return;
        }
        
        // Use the recommendations endpoint
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        const url = `${backendUrl}/recommendations/${userId}`;
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
  }, []);

  // Fetch popular books as a fallback
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
      {/* Banner with logo and title */}
      <Box sx={styles.banner}>
        <img src={BetterReadsLogo} alt="BetterReads Logo" style={styles.logoImage} />
        <Typography variant="h6" sx={styles.bannerText}>
          Discover your next favorite book.
        </Typography>
      </Box>

      <Container maxWidth="lg">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Recommended for You
              </Typography>
              {isGuest ? (
                <Typography>
                  Guest user: log in to see personalized recommendations.
                </Typography>
              ) : recommendations.length > 0 ? (
                <BookGalleryManager books={recommendations} limit={10} />
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
                <BookGalleryManager books={popularBooks} limit={10} />
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
  banner: {
    width: '100%',
    textAlign: 'center',
    padding: '2rem',
    marginBottom: '2rem',
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '0',
  },
  bannerText: {
    fontSize: '1.2rem',
    color: '#fff',
    marginBottom: '1rem',
    fontWeight: 500,
    fontFamily: 'Georgia, serif',
    marginTop: 4,
    fontStyle: 'italic'
  },
  logoImage: {
    width: '360px',
    height: '160px',
  },
};

export default RecommendationsPage;
