import React from 'react';
import './BookPage.css';

export const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className="star">
        {i <= rating ? '★' : '☆'}
      </span>
        );
    }
    return <div className="star-rating">{stars}</div>;
};

export const GenreTags = ({ genres }) => (
    <div className="genre-tags">
        {genres.map((genre, idx) => (
            <span key={idx} className="genre-tag">
        {genre}
      </span>
        ))}
    </div>
);
