import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Paper,
  Divider
} from '@mui/material';
import BookGalleryManager from '../components/Book/BookGalleryManager';
import BetterReadsLogo from '../images/icons/BetterReadsLogo.svg';
import BackgroundImage from '../images/background.svg';
import { DetectiveDustyBlue } from '../styles/colors';
import '../components/Book/BookPage.css';

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch recommendations on mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get the current user from localStorage if available
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = currentUser?.username || '';
        console.log("userId: ", userId);
        
        let url = 'http://localhost:3000/api/recommend';
        if (userId) {
          url = `http://localhost:3000/api/recommend/${userId}`;
        }
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch recommendations');
        const data = await res.json();
        
        if (data && data.recommendations) {
          setRecommendations(data.recommendations.map(book => book._id));
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
        const res = await fetch('http://localhost:3000/books/popular');
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
            {/* Personalized Recommendations */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Recommended for You
              </Typography>
              {recommendations.length > 0 ? (
                <BookGalleryManager books={recommendations} limit={10} />
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Typography>No personalized recommendations available yet. Try rating some books!</Typography>
              )}
            </Paper>

            {/* Popular Books */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Popular Books
              </Typography>
              {popularBooks.length > 0 ? (
                <BookGalleryManager books={popularBooks} limit={10} />
              ) : (
                <Typography>Loading popular books...</Typography>
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
