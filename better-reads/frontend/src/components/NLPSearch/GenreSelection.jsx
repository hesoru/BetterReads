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
