import React, { useState } from 'react';
import './BookPage.css';

export const GenreTags = ({ genres }) => {
    const [showAll, setShowAll] = useState(false);

    if (!Array.isArray(genres)) return null;

    const MAX_TAGS = 2;
    const visibleTags = showAll ? genres : genres.slice(0, MAX_TAGS);
    const hasMore = !showAll && genres.length > MAX_TAGS;

    const handleShowMore = () => {
        setShowAll(true);
    };

    return (
        <div className="genre-tags">
            {visibleTags.map((genre, idx) => (
                <span key={idx} className="genre-tag">
                    {genre}
                </span>
            ))}
            {hasMore && (
                <span
                    className="genre-tag more-tag"
                    title="Show all genres"
                    onClick={handleShowMore}
                    style={{ cursor: 'pointer' }}
                >
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




