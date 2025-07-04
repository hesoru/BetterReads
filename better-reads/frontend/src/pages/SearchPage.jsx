import { useState, useEffect, useCallback } from 'react';
import {
  TextField,
  Box,
  Typography,
  Grid,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BetterReadsLogo from '../images/icons/BetterReadsLogo.svg';
import BackgroundImage from '../images/background.png';
import { DetectiveDustyBlue } from '../styles/colors';
import { BookPreview } from '../components/Book/BookPreview';
import BookGalleryManager from '../components/Book/BookGalleryManager';
import '../components/Book/BookPage.css';
import BookUtils from "../utils/BookUtils.js";


const genres = [
  "Fantasy", "Fiction", "Nonfiction", "Classics", "Science Fiction",
  "Mystery", "Thriller", "Romance", "Historical Fiction", "Horror",
  "Literary Fiction", "Young Adult", "Biography", "Contemporary"
];

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch recommendations on mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get the current user from localStorage if available
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = currentUser?.username || '';
        
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
        // Fallback to popular books if recommendations fail
        try {
          const res = await fetch('http://localhost:3000/books/popular');
          if (!res.ok) throw new Error('Failed to fetch popular books');
          const data = await res.json();
          setRecommendations(data.map(book => book._id));
        } catch (fallbackErr) {
          setError(fallbackErr.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, []);

  // Search handler
  const handleSearch = useCallback(async () => {
    const trimmedQuery = searchQuery.trim();
    setLoading(true);
    setError(null);
    try {
      // const params = new URLSearchParams();
      // if (trimmedQuery) {
      //   params.append('q', trimmedQuery);
      // }
      // if (selectedGenres.length > 0) {
      //   params.append('genre', selectedGenres.join(','));
      // }
      //TODO: FOR FUNCTIONAL PAGE SCROLLING GO TO BOOK UTILS TO TWEAK PAGE & LIMIT PARAMS
      const data = await BookUtils.searchBooks({ q: trimmedQuery, genres: selectedGenres });
      // let url = 'http://localhost:3000/books';
      // if (params.toString()) {
      //   url = `http://localhost:3000/books/search?${params.toString()}`;
      // }
      //
      // const res = await fetch(url);
      // if (!res.ok) throw new Error('Search failed');
      // const data = await res.json();
      console.log("data", data);
      setSearchResults(data.results);
      setHasSearched(true); // Set hasSearched to true when search is performed
    } catch (err) {
      console.error('FETCH ERROR:', err);
      setError(err.message);
      setSearchResults([]);
      setHasSearched(true); // Set hasSearched to true even if search fails
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedGenres]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleGenreChange = (event) => {
    const { target: { value } } = event;
    setSelectedGenres(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div style={styles.container}>
      <section style={styles.banner}>
        <div style={styles.logoImage} />
        <Typography variant="h5" sx={styles.bannerText}>
          Reading is good for you. But we can make it better.
        </Typography>
      </section>

      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: 'center',
        maxWidth: 900,
        mx: 'auto',
        mb: 4,
        px: 2,
        mt: 4
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for books by title, author, or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{
            flexGrow: 1,
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
        <FormControl sx={{ width: { xs: '100%', md: 300 } }}>
          <Select
            id="genre-select"
            multiple
            displayEmpty
            value={selectedGenres}
            onChange={handleGenreChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em style={{ color: '#666' }}>Select genres...</em>;
              }
              return selected.join(', ');
            }}
            sx={{
              borderRadius: '25px',
              backgroundColor: DetectiveDustyBlue,
              height: '56px',
              width: '100%',
            }}
          >
            <MenuItem disabled value="">
              <em style={{ color: '#666' }}>Select genres...</em>
            </MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading && <Typography sx={{ textAlign: 'center', my: 2 }}>Loading...</Typography>}
      {error && <Typography color="error" sx={{ textAlign: 'center', my: 2 }}>{`Error: ${error}`}</Typography>}

      {/* Show recommendations before search, search results after */}
      {!hasSearched && recommendations.length > 0 && (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
            Recommended for you
          </Typography>
          <BookGalleryManager books={recommendations} limit={5} />
        </Box>
      )}
      
      {/* Show search results when search is performed */}
      {hasSearched && (
        <Grid
          container
          spacing={3}
          sx={{
            maxWidth: '1900px',
            margin: '0 auto',
            justifyContent: 'center',
            paddingBottom: '2rem'
          }}>
          {searchResults.length > 0 ? (
            searchResults.map((book, idx) => {
                  const key = book._id || book.id || idx;
              return (
                <Grid item xs={12} sm={6} md={4} key={key}>
                  <BookPreview
                    bookId={book._id || book.id || key}
                    coverUrl={book.image || book.coverImage || book.coverUrl}
                    title={book.title}
                    rating={book.averageRating || 0}
                    genres={book.genre || []}
                    isFavorite={book.isFavorite || false}
                    onToggleFavorite={() => { }}
                  />
                </Grid>
              );
            })
          ) : (
            <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
              <Typography variant="h6">No books found matching your search.</Typography>
            </Box>
          )}
        </Grid>
      )}
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
