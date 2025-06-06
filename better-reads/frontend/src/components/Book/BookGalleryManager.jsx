import React, { useRef } from 'react';
import {BookPreview} from './BookPreview';
import sampleData from "../../sampleData2.json";


const BookGalleryManager = ({ books, limit }) => {
    const bookData = sampleData.books;
    //console.log("bookData", bookData);
    //console.log("books", books)

    const uniqueBooks = Array.from(
        new Set(books)
    ).map(isbn => {
        const book = bookData[isbn];
        return book ? { isbn, ...book } : null;
    }).filter(Boolean);
   //
    // const uniqueBooks = Array.from(new Map(books.map(b => [b.isbn, b])).values());
    console.log("uniqueBooks", uniqueBooks);

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
                        console.log("sim", sim)


                        return (
                            <BookPreview
                                key={sim.details.isbn}
                                isbn={sim.details.isbn}
                                coverUrl={sim.details.coverUrl}
                                title={sim.details.title}
                                rating={Math.round(sim.details.averageRating)}
                                genres={sim.details.genres}
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
