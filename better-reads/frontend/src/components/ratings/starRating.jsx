import React from 'react';
import { Rating } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#F1C432', // Richer gold for filled stars
  },
  '& .MuiRating-iconEmpty': {
    color: '#C6C6C6', // Gray for empty stars
  },
});

const StarRating = ({ rating, totalStars = 5, isEditable = false, onChange }) => {
  return (
    <StyledRating
      name={isEditable ? "editable-rating" : "read-only"}
      value={rating}
      precision={0.5} // Allow half-star ratings
      max={totalStars}
      readOnly={!isEditable}
      onChange={onChange}
    />
  );
};

export default StarRating;
