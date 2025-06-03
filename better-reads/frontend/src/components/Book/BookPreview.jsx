import React from 'react';
import './BookPage.css';
import {GenreTags, StarRating} from "./BookUtils.jsx";


export default function BookPreview({ coverUrl, isbn, title, rating, averageRating, genres, isFavorite, onToggleFavorite }) {
    return (
        <div className="book-card">
            <div className="favorite-icon" onClick={onToggleFavorite}>
                {/* TODO: need image of heart*/}
                <span className="icon-heart">{isFavorite ? '❤️' : '♡'}</span>
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