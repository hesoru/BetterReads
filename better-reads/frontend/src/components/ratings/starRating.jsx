import React from 'react';
import { Rating } from '@mui/material';
import { styled } from '@mui/system';
import StarIcon from '@mui/icons-material/Star';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ffc107', // Standard yellow for filled stars
  },
  '& .MuiRating-iconHover': {
    color: '#ffc107',
  },
});

const StarRating = ({ rating, isEditable = false, onChange, totalStars = 5 }) => {
  return (
    <StyledRating
      name={isEditable ? "editable-rating" : "read-only"}
      value={rating}
      precision={isEditable ? 0.5 : 1} // Allow half-stars only when editable
      max={totalStars}
      readOnly={!isEditable}
      onChange={onChange}
      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
    />
  );
};

export default StarRating;
