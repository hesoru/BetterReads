import React from 'react';
import StarRating from '../ratings/starRating.jsx'; // Assumes StarRating is in components/ratings/
import { DetectiveDustyBlue, NoirNavy, PaperbackPureWhite } from '../../styles/colors.js';

const BookReview = ({
  userImage = "https://via.placeholder.com/120", // Default placeholder image
  username = "BookLover123",
  rating = 4, // Default rating
  reviewText = "This was a fantastic read! Highly recommend to anyone interested in the genre. The characters were well-developed and the plot was engaging from start to finish." // Default review text
}) => {
  const cardStyle = {
    backgroundColor: DetectiveDustyBlue,
    padding: '20px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center', // Vertically center align the columns
    gap: '20px',
    fontFamily: 'Arial, sans-serif', // A basic font stack
    color: NoirNavy, // Default text color for the card
    maxWidth: '1044px', // Example max width
    margin: '18px auto' // 18px top/bottom for 36px spacing, auto left/right for centering
  };

  const leftColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center image and username
    textAlign: 'center',
    flexShrink: 0 // Prevent this column from shrinking
  };

  const profileImageStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%', // Make it circular
    objectFit: 'cover', // Ensure the image covers the area well
    marginBottom: '10px',
    backgroundColor: PaperbackPureWhite // A light background for the placeholder
  };

  const usernameStyle = {
    fontWeight: 'bold',
    fontSize: '16px'
  };

  const rightColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Left-align content (star rating, review text)
    gap: '10px', // Space between star rating and review text
    flexGrow: 1 // Allow this column to take remaining space
  };

  const reviewTextStyle = {
    fontSize: '14px',
    lineHeight: '1.6',
    textAlign: 'left' // Ensure review text is left-aligned
  };

  return (
    <div style={cardStyle}>
      <div style={leftColumnStyle}>
        <img src={userImage} alt={`${username}'s profile`} style={profileImageStyle} />
        <p style={usernameStyle}>{username}</p>
      </div>
      <div style={rightColumnStyle}>
        <StarRating rating={rating} />
        <p style={reviewTextStyle}>{reviewText}</p>
      </div>
    </div>
  );
};

export default BookReview;
