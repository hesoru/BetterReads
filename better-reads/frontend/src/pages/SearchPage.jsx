import { useState, useEffect, useCallback } from 'react';
import {
  TextField,
  Box,
  Typography,
  Grid,
  IconButton,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BetterReadsLogo from '../images/icons/BetterReadsLogo.svg';
import BackgroundImage from '../images/background.png';
import { DetectiveDustyBlue } from '../styles/colors';
import { BookPreview } from '../components/Book/BookPreview';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = useCallback(async (pageToFetch = 1, append = false) => {
    const trimmedQuery = searchQuery.trim();
    setLoading(true);
    setError(null);
    try {
      const data = await BookUtils.searchBooks({ q: trimmedQuery, genres: selectedGenres, page: pageToFetch });
      if (append) {
        setSearchResults(prev => [...prev, ...(data.results || [])]);
      } else {
        setSearchResults(data.results || []);
      }
      setTotalPages(data.totalPages || 0);
      setPage(pageToFetch);
    } catch (err) {
      console.error('FETCH ERROR:', err);
      setError(err.message);
      if (!append) {
        setSearchResults([]);
      }
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedGenres]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(1, false); // Always fetch page 1 and replace results on new search
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedGenres, handleSearch]);

  const handleShowMore = () => {
    handleSearch(page + 1, true); // Fetch next page and append
  };

  const handleGenreChange = (event) => {
    const { target: { value } } = event;
    setSelectedGenres(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      backgroundImage: `url(${BackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed',
    }}>
      <section style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        position: 'relative',
      }}>
        <div style={{
          height: '100px',
          width: '100%',
          backgroundImage: `url(${BetterReadsLogo})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          marginBottom: '1rem',
        }} />
        <Typography variant="h5" style={{
          fontFamily: "'Source Serif Pro', serif",
          fontStyle: 'italic',
          color: '#FFFFFF',
          textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
        }}>
          Reading is good for you. But we can make it better.
        </Typography>
      </section>

      <Box sx={{ backgroundColor: 'white', flexGrow: 1, paddingTop: '2rem' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: 'center',
          maxWidth: 900,
          mx: 'auto',
          mb: 4,
          px: 2,
        }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for books by title, author, or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
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
                <IconButton onClick={() => handleSearch(1)}>
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
          !loading && (
            <Box sx={{ textAlign: 'center', width: '100%', py: 4 }}>
              <Typography variant="h6">No books found matching your search.</Typography>
            </Box>
          )
        )}
      </Grid>

      {page < totalPages && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Button
            variant="outlined"
            onClick={handleShowMore}
            disabled={loading}
            sx={{
              fontFamily: 'Albert Sans, sans-serif',
              fontStyle: 'italic',
              color: '#151B54',
              borderColor: '#151B54',
              borderWidth: '1px',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: '#151B54',
                color: 'white',
                borderColor: '#151B54',
              },
            }}
          >
            {loading ? 'Loading...' : 'Show More Books'}
          </Button>
        </Box>
      )}
      </Box>
    </div>
  );
};



export default SearchPage;
