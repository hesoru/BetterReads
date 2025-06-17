import React, {useEffect, useState} from 'react';
import StarRating from '../ratings/starRating.jsx'; // Assumes StarRating is in components/ratings/
import { DetectiveDustyBlue, NoirNavy, PaperbackPureWhite } from '../../styles/colors.js';

const BookReview = ({
  userImage, // Default placeholder image
  username,
  rating , // Default rating
  reviewText = "No review left yet.", // Default review text,
    //TODO: Ore was here
                      editable = false,
                      onSave = () => {}

}) => {

  //TODO: Ore was here
  const [editRating, setEditRating] = useState(rating);
  const [editText, setEditText] = useState(reviewText || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setEditRating(rating || 0);
  }, [rating]);

  useEffect(() => {
    setEditText(reviewText || '');
  }, [reviewText]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSave({ rating: editRating, description: editText });
    } catch (err) {
      console.error('Failed to save review:', err);
    } finally {
      setSubmitting(false);
    }
  };
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

  //TODO: Ore was here
  const textareaStyle = {
    width: '100%',
    fontSize: '14px',
    lineHeight: '1.6',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    resize: 'vertical'
  };

  const buttonStyle = {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: NoirNavy,
    color: PaperbackPureWhite,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };
  return (
    <div style={cardStyle}>
      <div style={leftColumnStyle}>
        <img src={userImage} alt={`${username}'s profile`} style={profileImageStyle} />
        <p style={usernameStyle}>{username}</p>
      </div>
      <div style={rightColumnStyle}>
        {editable ? (
            <>
              <StarRating rating={editRating} setRating={setEditRating} editable />
              <textarea
                  placeholder="Write your review..."
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={4}
                  style={textareaStyle}
              />
              <button onClick={handleSubmit} style={buttonStyle}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </>
        ) : (
            <>
              <StarRating rating={rating} />
              <p style={reviewTextStyle}>{reviewText}</p>
            </>
        )}
      </div>
    </div>
  );
};

export default BookReview;
