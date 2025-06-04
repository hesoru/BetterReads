import React from 'react';
import './BookPage.css';
import {FavoriteIcon, GenreTags, StarRating} from "./BookUtils.jsx";



export default function BookPreview({ coverUrl, isbn, title, rating, averageRating, genres, isFavorite, onToggleFavorite }) {
    return (
        <div className="book-card">
            <div className="favorite-icon" onClick={onToggleFavorite} role="button" aria-label="Toggle favorite">
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
            <img src={coverUrl} alt={`${title} cover`} />
            <div className="card-content">
                <div className="card-title">{title}</div>
                <div className="card-rating">
                    <StarRating rating={rating} />
                    <span className="rating-value">{averageRating.toFixed(1)}</span>
                </div>
                <GenreTags genres={genres} />
            </div>
        </div>
    );
}