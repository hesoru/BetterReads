import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { BookPreview } from './BookPreview';
import BookUtils from "../../utils/BookUtils.js";

const BookGalleryManager = ({ books, limit }) => {
    const [bookData, setBookData] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            if (!books || books.length === 0) {
                setBookData([]);
                return;
            }

            const seen = new Set();
            const fetched = [];
            const booksToFetch = limit ? books.slice(0, limit) : books;

            for (const bookId of booksToFetch) {
                if (!bookId || seen.has(bookId)) continue;
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
    }, [books, limit]);

    return (
        <Grid container spacing={2}>
            {bookData.map((book) => (
                <Grid item key={book._id} xs={6} sm={4} md={3} lg={2.4}>
                    <BookPreview
                        bookId={book._id}
                        isbn={book.ISBN}
                        coverUrl={book.image}
                        title={book.title}
                        rating={Math.round(book.averageRating)}
                        genres={book.genre}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default BookGalleryManager;
