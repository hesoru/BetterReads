import React, { useRef } from 'react';
import BookPreview from './BookPreview';


const BookGalleryManager = ({ books, limit }) => {

    const scrollRef = useRef(null);
    const CARD_WIDTH = 240;
    const GAP = 28;
    const scrollAmount = (CARD_WIDTH + GAP) * limit;

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    const totalVisibleWidth = scrollAmount - GAP;

    return (
        <div className="container similar-books">

            <div className="book-gallery-wrapper" style={{ maxWidth: `${totalVisibleWidth}px` }}>
                <button className="scroll-arrow left" onClick={scrollLeft} />

                <div className="books-row-scroll" ref={scrollRef}>
                    {books.map((book) => (
                        <BookPreview
                            key={book.isbn}
                            coverUrl={book.coverUrl}
                            isbn={book.isbn}
                            title={book.title}
                            rating={Math.round(book.averageRating)}
                            averageRating={book.averageRating}
                            genres={book.genres}
                            isFavorite={book.isFavorite}
                        />
                    ))}
                </div>

                <button className="scroll-arrow right" onClick={scrollRight} />
            </div>
        </div>
    );

};

export default BookGalleryManager;
