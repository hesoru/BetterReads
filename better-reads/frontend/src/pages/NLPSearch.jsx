import React, { useState } from 'react'
import HeroBanner from '../components/common/HeroBanner';
import { Typography, Button, Box, Grid, CircularProgress } from '@mui/material';
import { DetectiveDustyBlue, NoirNavy, NovellaNavy } from '../styles/colors';
import GenreSelection from "../components/NLPSearch/GenreSelection";
import YearSelection from '../components/NLPSearch/YearSelection';
import { TextField } from '@mui/material';
import { BookPreview } from "../components/Book/BookPreview";

const NLPSearch = () => {
    const [genre, setGenre] = useState([]);
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [keyword, setKeyword] = useState("");
    const [result, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
    if (loading) return;

    setLoading(true);
    setResults([]);
    try {
        const params = new URLSearchParams();

        if (keyword) params.append('q', keyword);
        if (genre.length > 0) genre.forEach(g => params.append('genre', g));
        if (startYear) params.append('min_year', startYear);
        if (endYear) params.append('max_year', endYear);

        const response = await fetch(`http://localhost:5002/search?${params.toString()}`);
        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not valid JSON');
        }
        const data = await response.json();
        setResults(data);
    } catch (err) {
        console.error('Search failed:', err);
    } finally {
        setLoading(false);
    }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
    }}>
    <HeroBanner title="Use our AI Natural Language Processing engine to find books" />
    <Box component="section" sx={{ backgroundColor: "white", padding: "2rem" }}>
        <Box sx={{ display: "flex", flexDirection: { xs: 'column', md: 'row' }, gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
            <Box sx={{ flex: 1, width: '100%' }}>
              <GenreSelection onSelectGenres={setGenre} />
            </Box>

            <Box sx={{ display: "flex", gap: "0.5rem", flex: 2, width: '100%' }}>
              <YearSelection fromYear={startYear} toYear={endYear} onChangeFrom={(e) => setStartYear(e.target.value)} onChangeTo={(e) => setEndYear(e.target.value)}/>
            </Box>
        </Box>
        <div>
            <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Show me a gay love story between a werewolf and a vampire..."
                variant="outlined"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '25px',
                        backgroundColor: DetectiveDustyBlue,
                    },
                }}
            />
        </div>
    </Box>
    <Button
      variant="contained"
      onClick={handleSearch}
      sx={{
        backgroundColor: 'red',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: '1rem',
        padding:'1rem',
        borderRadius: '8px',
        mx: 'auto',
      }}
    >
      Find NLP Match
    </Button>
    {loading && (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: NoirNavy }} />
      </Box>
    )}
    {!loading && result.length > 0 && (
      <Box
        mt={4}
        px={6}
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap={2}
      >
        {result.map((book) => (
            <Grid
              item
              key={book._id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
            <Box
              sx={{
                width: '100%',
                maxWidth: 280,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  mb: 1,
                  color: NovellaNavy,
                  fontStyle: 'italic',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                }}
              >
                Match Score: {book.score ? `${(book.score * 100).toFixed(2)}%` : null}
              </Typography>

              <BookPreview
                bookId={book._id}
                coverUrl={book.image}
                title={book.title}
                rating={book.averageRating || 0}
                genres={book.genre}
              />
            </Box>
            </Grid>
        ))}
      </Box>
    )}
    </div>
  )
}

export default NLPSearch




