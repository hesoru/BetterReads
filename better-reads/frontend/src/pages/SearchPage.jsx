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
import '../components/Book/BookPage.css';

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

  const handleSearch = useCallback(async () => {
    const trimmedQuery = searchQuery.trim();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (trimmedQuery) {
        params.append('q', trimmedQuery);
      }
      if (selectedGenres.length > 0) {
        params.append('genres', selectedGenres.join(','));
      }

      let url = 'http://localhost:3000/books';
      if (params.toString()) {
        url = `http://localhost:3000/books/search?${params.toString()}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('FETCH ERROR:', err);
      setError(err.message);
      setSearchResults([]);
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

      <Grid
        container
        spacing={3}
        sx={{
          maxWidth: '1900px',
          margin: '0 auto',
          justifyContent: 'center',
          paddingBottom: '2rem'
        }}>
        {searchResults.map((book, idx) => {
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
        })}
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
