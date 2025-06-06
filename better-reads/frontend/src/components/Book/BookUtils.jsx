import React from 'react';
import './BookPage.css';

export const GenreTags = ({ genres }) => (
    <div className="genre-tags">
        {Array.isArray(genres) && genres.map((genre, idx) => (
            <span key={idx} className="genre-tag">
        {genre}
      </span>
        ))}
    </div>
);

export const FavoriteIcon = ({ isFavorite, onClick }) => {
    const iconSrc = isFavorite
        ? '/src/assets/icons/favorite-filled.svg'
        : '/src/assets/icons/favorite-outline.svg';

    return (

            <img
                src={iconSrc}
                alt="Favorite Icon"
                className="favorite-icon"
                onClick={onClick}
                role="button"
            />


    );
};




