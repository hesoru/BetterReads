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

const StarRating = ({ rating, totalStars = 5, isEditable = false, onChange }) => {
  return (
    <StyledRating
      name={isEditable ? "editable-rating" : "read-only"}
      value={rating}
      precision={1} // Use whole numbers for editable ratings
      max={totalStars}
      readOnly={!isEditable}
      onChange={onChange}
    />
  );
};

export default StarRating;
