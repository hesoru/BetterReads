import React from 'react';
import { Rating } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#F1E132', // Yellow for filled stars
  },
  '& .MuiRating-iconEmpty': {
    color: '#C6C6C6', // Gray for empty stars
  },
});

const StarRating = ({ rating, totalStars = 5 }) => {
  return (
    <StyledRating
      name="read-only"
      value={rating}
      precision={0.5}
      max={totalStars}
      readOnly
    />
  );
};

export default StarRating;
