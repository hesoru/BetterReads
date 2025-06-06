import { useState, useMemo, useCallback } from 'react';
import {
  TextField,
  Box,
  Typography,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import sampleData from '../sampleData.json';
import BetterReadsLogo from '../images/icons/BetterReadsLogo.svg';
import BackgroundImage from '../images/background.svg';
import { DetectiveDustyBlue } from '../styles/colors';
import { BookPreview } from '../components/Book/BookPreview';
import '../components/Book/BookPage.css';


const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const allBooks = useMemo(() => {
    const mainBook = {
      ...sampleData.book,
      id: sampleData.book.isbn,
      coverImage: sampleData.book.coverUrl,
    };
    return [mainBook, ...sampleData.similarBooks.map(book => ({
      id: book.isbn,
      title: book.title,
      coverImage: book.coverUrl,
      genres: book.genres,
      averageRating: book.averageRating,
      isFavorite: book.isFavorite
    }))];
  }, []);

  const handleSearch = useCallback(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setSearchResults(allBooks);
      return;
    }
    
    const query = trimmedQuery.toLowerCase();
    const filtered = allBooks.filter(book =>
      book.title.toLowerCase().includes(query) ||
      (book.genres && book.genres.some(genre =>
        genre.toLowerCase().includes(query)
      ))
    );
    setSearchResults(filtered);
  }, [searchQuery, allBooks]);

  return (
    <div style={styles.container}>
      
      <section style={styles.banner}>
        <div style={styles.logoImage} />
        <Typography variant="h5" sx={styles.bannerText}>
          Reading is good for you. But we can make it better.
        </Typography>
      </section>
      
      <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4, px: 2, mt: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for books by title, author, or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              backgroundColor: DetectiveDustyBlue,
              '&:hover fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid 
        container 
        spacing={3} 
        sx={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          justifyContent: 'center'
        }}>
        {searchResults.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
              <BookPreview
                isbn={book.id}
                coverUrl={book.coverImage}
                title={book.title}
                rating={book.averageRating || 0}
                genres={book.genres || []}
                isFavorite={book.isFavorite || false}
                onToggleFavorite={() => {}}
              />
          </Grid>
        ))}
      </Grid>
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
    margin: '0 auto',
    backgroundImage: `url(${BetterReadsLogo})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }
};

export default SearchPage;
