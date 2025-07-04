import React, { useEffect, useState } from 'react';
import StarRating from '../ratings/starRating';
import { DetectiveDustyBlue, NoirNavy, PaperbackPureWhite } from '../../styles/colors.js';

// This component handles both displaying an existing review and creating/editing a new one.
const BookReview = ({
  review, // The existing review object, if it exists
  user,   // The current user object
  book,   // The book object
  editable = false, // Flag to determine if the component is in edit/create mode
  onSave, // Function to call when submitting the review
  onCancel, // Function to call when cancelling an edit
}) => {
  const [currentRating, setCurrentRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize state when the review prop changes
  useEffect(() => {
    setCurrentRating(review?.rating || 0);
    setReviewText(review?.review_text || '');
  }, [review]);

  const handleSubmit = async () => {
    if (!user || !book) {
      console.error("User or book information is missing.");
      return;
    }
    setIsSubmitting(true);
    try {
      // The onSave function is expected to be passed from the parent (BookDetailsPage)
      // and should handle the API call.
      await onSave({ rating: currentRating, description: reviewText });
    } catch (err) {
      console.error('Failed to save review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styling (can be moved to a CSS file later)
  const containerStyle = {
    backgroundColor: DetectiveDustyBlue,
    padding: '20px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    fontFamily: 'Arial, sans-serif',
    color: NoirNavy,
    maxWidth: '1044px',
    margin: '18px auto',
  };

  const leftColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    flexShrink: 0,
  };

  const profileImageStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
    backgroundColor: PaperbackPureWhite,
  };

  const rightColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '10px',
    flexGrow: 1,
  };

  const buttonStyle = {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: NoirNavy,
    color: PaperbackPureWhite,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const username = user?.username || "Guest";
  const userImage = user?.profile_image_url || '../../src/images/icons/User_Profile_Image_NoLogo.png';

  return (
    <div style={containerStyle}>
      <div style={leftColumnStyle}>
        <img alt={`${username}'s profile`} src={userImage} style={profileImageStyle} />
        <p style={{ fontWeight: 'bold', fontSize: '16px', margin: 0 }}>{username}</p>
      </div>
      <div style={rightColumnStyle}>
        {editable ? (
          <>
            <StarRating
              rating={currentRating}
              isEditable={true}
              onChange={(event, newValue) => {
                setCurrentRating(newValue);
              }}
            />
            <textarea
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
              style={{ width: '100%', fontSize: '14px', lineHeight: '1.6', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSubmit} disabled={isSubmitting} style={buttonStyle}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
              {onCancel && <button onClick={onCancel} style={{...buttonStyle, backgroundColor: '#777'}}>Cancel</button>}
            </div>
          </>
        ) : (
          <>
            <StarRating rating={currentRating} />
            <p style={{ margin: 0 }}>{reviewText || 'No review text.'}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default BookReview;
