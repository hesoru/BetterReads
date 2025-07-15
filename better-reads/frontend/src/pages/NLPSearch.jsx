import React, { useState } from 'react'
import BackgroundImage from '../images/background.png';
import BetterReadsLogo from '../images/icons/BetterReadsLogo.svg';
import { Typography, Button, Box, Grid } from '@mui/material';
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

    const handleSearch = async () => {
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
    }
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
          Use our Natural Language Processing engine to find books
        </Typography>
    </section>
    <section style={{ color: "white", padding: "6rem" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ flex: 1 }}>
            <GenreSelection onSelectGenres={setGenre} />
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flex: 2 }}>
            <YearSelection fromYear={startYear} toYear={endYear} onChangeFrom={(e) => setStartYear(e.target.value)} onChangeTo={(e) => setEndYear(e.target.value)}/>
            </div>
        </div>
        <div>
            <TextField
                fullWidth
                placeholder="Enter keywords..."
                variant="outlined"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                sx={{
                    '& .MuiOutlinedInput-root': {
                    height: {
                        xs: 48,
                        sm: 56,
                        md: 64,
                    },
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    },
                    '& .MuiInputBase-input': {
                    fontSize: {
                        xs: '0.9rem',
                        sm: '1rem',
                    },
                    padding: '0.75rem 1rem',
                    },
                }}
            />
        </div>
    </section>
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
    {result.length > 0 && (
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
                  color: 'yellow',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                }}
              >
                Match Score: {book.score?.toFixed(3)}
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




