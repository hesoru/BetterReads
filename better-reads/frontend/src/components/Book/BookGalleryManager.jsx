import React, { useEffect, useRef, useState } from 'react';
import { BookPreview } from './BookPreview';
import BookUtils from "../../utils/BookUtils.js";

const BookGalleryManager = ({ books, limit }) => {
    const [bookData, setBookData] = useState([]);
    const scrollRef = useRef(null);
    const CARD_WIDTH = 240;
    const GAP = 28;
    const scrollAmount = (CARD_WIDTH + GAP) * limit;
    const totalVisibleWidth = scrollAmount - GAP;

    // Fetch book data on mount or when books array changes
    useEffect(() => {
        const fetchBooks = async () => {
            const seen = new Set();
            const fetched = [];

            console.log("books: ", books);
            for (const bookId of books) {
                if (seen.has(bookId)) continue;
                seen.add(bookId);

                try {
                    const book = await BookUtils.getBookById(bookId);
                    if (book) {
                        fetched.push(book);
                    }
                } catch (err) {
                    console.error(`Failed to fetch book with ID ${bookId}:`, err);
                }
            }

            setBookData(fetched);
        };

        fetchBooks();
    }, [books]);

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
        <div className="container similar-books">
            <div className="book-gallery-wrapper" style={{ maxWidth: `${totalVisibleWidth}px` }}>
                <button className="scroll-arrow left" onClick={scrollLeft} />

                <div className="books-row-scroll" ref={scrollRef}>
                    {bookData.map((book) => (
                        <BookPreview
                            key={book._id}
                            bookId={book._id}
                            isbn = {book.ISBN}
                            coverUrl={book.image}
                            title={book.title}
                            rating={Math.round(book.averageRating)}
                            genres={book.genre}
                        />
                    ))}
                </div>

                <button className="scroll-arrow right" onClick={scrollRight} />
            </div>
        </div>
    );
};

export default BookGalleryManager;
