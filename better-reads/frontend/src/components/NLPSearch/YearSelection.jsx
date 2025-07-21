import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Box
} from '@mui/material';

import { DetectiveDustyBlue, PaperbackPureWhite } from '../../styles/colors';
import { sanitizeContent } from '../../utils/sanitize';

const ITEM_HEIGHT = 30;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6,
      backgroundColor: PaperbackPureWhite,
      color: 'rgba(0, 0, 0, 0.87)',
      borderRadius: '4px',
      boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    },
  },
};

const YearSelection = ({ fromYear, toYear, onChangeFrom, onChangeTo }) => {
  const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 1950 + i);
  
  // Wrap the change handlers to sanitize inputs
  const handleFromYearChange = (e) => {
    const sanitizedValue = sanitizeContent(e.target.value);
    onChangeFrom({ ...e, target: { ...e.target, value: sanitizedValue } });
  };
  
  const handleToYearChange = (e) => {
    const sanitizedValue = sanitizeContent(e.target.value);
    onChangeTo({ ...e, target: { ...e.target, value: sanitizedValue } });
  };

  return (
    <Box sx={{ mt: 2, mb: 1, display: 'flex', gap: '0.5rem', width: '100%' }}>
      <FormControl sx={{ width: '100%' }}>
        <Select
          value={fromYear}
          onChange={handleFromYearChange}
          displayEmpty
          input={<OutlinedInput />}
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
          onChange={handleToYearChange}
          displayEmpty
          input={<OutlinedInput />}
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
