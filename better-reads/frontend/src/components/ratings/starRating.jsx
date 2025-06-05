import React from 'react';
import ReviewStar from './reviewStar'; // Assuming reviewStar.jsx is in the same directory

const StarRating = ({ rating, totalStars = 5 }) => {
  const stars = [];
  for (let i = 1; i <= totalStars; i++) {
    let fillLevel = 0;
    if (rating >= i) {
      fillLevel = 1; // Full star
    } else if (rating > i - 1) {
      // This star is partially filled
      fillLevel = rating - (i - 1); // e.g. rating 3.75, i=4 -> fillLevel = 0.75
    }
    
    stars.push(<ReviewStar key={i} fillLevel={fillLevel} />);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }} role="img" aria-label={`Rating: ${rating} out of ${totalStars} stars`}>
      {stars}
      {/* You could optionally display the rating number here too */}
      {/* <span style={{ marginLeft: '8px', fontSize: '16px' }}>{rating.toFixed(1)}</span> */}
    </div>
  );
};

export default StarRating;
