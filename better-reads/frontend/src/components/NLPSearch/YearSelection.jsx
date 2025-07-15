import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Box
} from '@mui/material';

const PaperbackPureWhite = '#ffffff';

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

const YearSelection = ({ fromYear, toYear, onChangeFrom, onChangeTo }) => {
  const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 1950 + i);

  return (
    <Box sx={{ mt: 2, mb: 1, display: 'flex', gap: '0.5rem', width: '100%' }}>
      <FormControl sx={{ width: '100%' }}>
        <Select
          value={fromYear}
          onChange={onChangeFrom}
          displayEmpty
          input={<OutlinedInput sx={{ height: 48 }} />}
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
          <MenuItem value=""><em>Year From</em></MenuItem>
          {years.map((year) => (
            <MenuItem key={`from-${year}`} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
     _
      <FormControl sx={{ width: '100%' }}>
        <Select
          value={toYear}
          onChange={onChangeTo}
          displayEmpty
          input={<OutlinedInput sx={{ height: 48 }} />}
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
          <MenuItem value=""><em>Year To</em></MenuItem>
          {years.map((year) => (
            <MenuItem key={`to-${year}`} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default YearSelection;
