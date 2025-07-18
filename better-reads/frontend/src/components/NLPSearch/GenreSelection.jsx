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

import { DetectiveDustyBlue, PaperbackPureWhite } from '../../styles/colors';
import { sanitizeContent } from '../../utils/sanitize';

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
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      backgroundColor: PaperbackPureWhite,
      color: 'rgba(0, 0, 0, 0.87)',
      borderRadius: '4px',
      boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    },
  },
};

const GenreSelection = ({ onSelectGenres = () => {} }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleChange = (event) => {
    const { target: { value } } = event;
    
    // Sanitize genre selections
    const sanitizedValue = typeof value === 'string' 
      ? sanitizeContent(value) 
      : value;
    
    const newSelectedGenres = typeof sanitizedValue === 'string' 
      ? sanitizedValue.split(',') 
      : sanitizedValue.map(genre => sanitizeContent(genre));
    
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
              return <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Favorite Genres</span>;
            }
            return selected.join(', ');
          }}
          MenuProps={MenuProps}
          sx={{
            borderRadius: '25px',
            backgroundColor: DetectiveDustyBlue,
            color: 'black',
            '& .MuiSvgIcon-root': {
              color: 'black',
            },
          }}
        >
          {genres.map((genre) => (
            <MenuItem key={genre} value={genre}>
              <Checkbox checked={selectedGenres.indexOf(genre) > -1} />
              <ListItemText primary={genre} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default GenreSelection;
