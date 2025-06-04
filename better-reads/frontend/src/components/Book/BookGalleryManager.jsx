import React from 'react';
import BookPreview from './BookPreview';

const BookGalleryManager = ({ books, limit }) => {

    const displayedBooks = books.slice(0, limit);

    return (
        <div className="container similar-books">
            <div className="section-title">Readers who liked this book enjoyed:</div>
            <div className="books-row-scroll">
                {displayedBooks.map((sb) => (
                    <BookPreview
                        key={sb.isbn}
                        coverUrl={sb.coverUrl}
                        isbn={sb.isbn}
                        title={sb.title}
                        rating={Math.round(sb.averageRating)}
                        averageRating={sb.averageRating}
                        genres={sb.genres}
                        isFavorite={sb.isFavorite}
                    />
                ))}
            </div>
        </div>
    );
};

export default BookGalleryManager;
