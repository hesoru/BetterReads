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

  const [editRating, setEditRating] = useState(rating ?? null);
  const [editText, setEditText] = useState(reviewText && reviewText !== "No review left yet." ? reviewText : "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setEditRating(rating ?? null);
    setEditText(reviewText && reviewText !== "No review left yet." ? reviewText : "");
  }, [rating, reviewText]);

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









  return (
    <div className="book-review-card">
      <div className="review-left-column">
        <img src={userImage} alt={`${username}'s profile`} className="review-profile-image" />
        <div className="review-username">{username}</div>
      </div>
      <div className="review-right-column">
        {editable ? (
          <>
            <StarRating rating={editRating} onRating={setEditRating} editable={true} />
            <textarea
              className="review-textarea"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Write your review..."
              rows={4}
            />
            <button className="review-submit-button" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </>
        ) : (
          <>
            <StarRating rating={rating} editable={false} />
            <p className="review-text">{reviewText}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default BookReview;
