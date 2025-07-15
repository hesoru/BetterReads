import React, { useState } from 'react';
import {
  Box,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
} from '@mui/material';

const PaperbackPureWhite = '#ffffff';

const genres = [
  'Fantasy',
  'Fiction',
  'Nonfiction',
  'Classics',
  'Science Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Historical Fiction',
  'Horror',
  'Literary Fiction',
  'Young Adult',
  'Biography',
  'Contemporary',
];

const ITEM_HEIGHT = 30;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6,
      backgroundColor: '#1e213d',
      color: PaperbackPureWhite,
    },
  },
};

const GenreSelection = ({ onSelectGenres = () => {} }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleChange = (event) => {
    const { target: { value } } = event;
    const newSelectedGenres = typeof value === 'string' ? value.split(',') : value;
    setSelectedGenres(newSelectedGenres);
    onSelectGenres(newSelectedGenres);
  };

  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      <FormControl sx={{ width: '100%' }}>
        <Select
          labelId="genre-multiple-checkbox-label"
          id="genre-multiple-checkbox"
          multiple
          displayEmpty
          value={selectedGenres}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Favorite Genres</span>;
            }
            return selected.join(', ');
          }}
          MenuProps={MenuProps}
          sx={{
            height: 48,
            color: PaperbackPureWhite,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: PaperbackPureWhite,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: PaperbackPureWhite,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: PaperbackPureWhite,
            },
            '& .MuiSvgIcon-root': {
              color: PaperbackPureWhite,
            },
          }}
        >
          {genres.map((genre) => (
            <MenuItem key={genre} value={genre}>
              <Checkbox checked={selectedGenres.indexOf(genre) > -1} sx={{color: PaperbackPureWhite, '&.Mui-checked': {color: PaperbackPureWhite}}}/>
              <ListItemText primary={genre} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default GenreSelection;
