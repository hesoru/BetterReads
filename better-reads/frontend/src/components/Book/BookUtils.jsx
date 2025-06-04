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

export const FavoriteIcon = ({ isFavorite }) => {
    return (
        <div className="favorite-icon" role="button" aria-label="Toggle favorite">
            <svg
                className="icon-heart"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 58 58"
                width="20"
                height="20"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M29.1667 39.9958L27.1125 38.1258C19.8167 31.51 15 27.1325 15 21.7917C15 17.4142 18.4283 14 22.7917 14C25.2567 14 27.6225 15.1475 29.1667 16.9467C30.7108 15.1475 33.0767 14 35.5417 14C39.905 14 43.3333 17.4142 43.3333 21.7917C43.3333 27.1325 38.5167 31.51 31.2208 38.1258L29.1667 39.9958Z" />
            </svg>
        </div>
    );
};
