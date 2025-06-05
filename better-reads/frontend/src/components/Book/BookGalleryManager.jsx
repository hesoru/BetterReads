import React, { useRef } from 'react';
import {BookPreview} from './BookPreview';
import sampleData from "../../sampleData2.json";


const BookGalleryManager = ({ books, limit }) => {
    const bookData = sampleData.books;
    const uniqueBooks = Array.from(new Map(books.map(b => [b.isbn, b])).values());

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
                    {uniqueBooks.map((sim) => {
                        const matchedBook = bookData[sim.isbn];
                        console.log(sim)

                        if (!matchedBook) return null;

                        return (
                            <BookPreview
                                key={sim.isbn}
                                isbn={sim.isbn}
                                coverUrl={matchedBook.details.coverUrl}
                                title={matchedBook.details.title}
                                rating={Math.round(matchedBook.details.averageRating)}
                                genres={matchedBook.details.genres}
                                isFavorite={sim.isFavorite}
                            />
                        );
                    })}

                </div>

                <button className="scroll-arrow right" onClick={scrollRight} />
            </div>
        </div>
    );

};

export default BookGalleryManager;
