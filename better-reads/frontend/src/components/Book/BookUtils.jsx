import React from 'react';
import './BookPage.css';

export const GenreTags = ({ genres }) => {
    if (!Array.isArray(genres)) return null;

    const MAX_TAGS = 2;
    const visibleTags = genres.slice(0, MAX_TAGS);
    const hasMore = genres.length > MAX_TAGS;

    return (
        <div className="genre-tags">
            {visibleTags.map((genre, idx) => (
                <span key={idx} className="genre-tag">
                    {genre}
                </span>
            ))}
            {hasMore && (
                <span className="genre-tag more-tag" title={genres.slice(MAX_TAGS).join(', ')}>
                    +{genres.length - MAX_TAGS} more
                </span>
            )}
        </div>
    );
};

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




