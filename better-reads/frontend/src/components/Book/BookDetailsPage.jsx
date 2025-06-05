import React from 'react';
import './BookPage.css';
import {BookPreview} from './BookPreview';
import { GenreTags } from "./BookUtils.jsx";
import StarRating from '../ratings/starRating'; // Assuming starRating.jsx exports as default or named StarRating
import BookGalleryManager from "./BookGalleryManager.jsx";
import BookReview from '../bookReview'; // Assuming bookReview.jsx exports as default
import sampleData from "../../sampleData2.json";
import {useParams} from "react-router-dom";
// navLinks: [home: "/"],
// book: { coverUrl, author, publishYear, title, summary, isbn (key), genres: [], averageRating, reviews : [] }
// userReview: { avatarUrl, username }
// otherReviews: [ { id, username, avatarUrl, rating, text } ]
// similarBooks: [ { isbn, coverUrl, title, rating, averageRating, genres: [], isFavorite } ]
// onToggleFavorite: function(isbn)


export default function BookDetailsPage( ) {
    const isbn = useParams();
    const book = sampleData.books[isbn.isbn];

    //console.log(book.details.genres);
    return (
        <div>
            <div className="container book-page">
                {/* Book Cover & Info */}
                <div className="book-cover-container">
                    <img
                        src={book.details.coverUrl}
                        alt={`${book.details.title} cover`}
                        className="book-cover"
                    />
                    <StarRating rating={Math.round(book.details.averageRating)} />
                    <div className="load-more">
                        <button className="btn">Make Review</button>
                    </div>

                </div>

                <div className="book-info">
                    <h1 className="book-title">{book.details.title}</h1>
                    <p className="book-summary">{book.details.summary}</p>
                    <div className="isbn">ISBN: {book.details.isbn}</div>
                    <GenreTags genres={book.details.genres} />



                </div>
            </div>

            <div className="reviews-container">
                <div className="review-section">
                    <div className="section-title">Your Review</div>
                    {/* Placeholder for user's own review input - for now, a sample BookReview */}
                    <BookReview
                        userImage={book.userReview.coverUrl}
                        username={book.userReview.username}
                        rating={book.userReview.rating}
                        reviewText={book.userReview.text} />
                    {/* <BookReview
                        userImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80" 
                        username="YourUsername" 
                        rating={5} 
                        reviewText="This is where your insightful review would go! You loved this book and can't wait to tell everyone about it."
                    />
                    */}
                </div>

                <div className="other-reviews">
                    <div className="section-title">Reviews from Other Readers</div>
                    {book.otherReviews.map((review, idx) => (
                        <BookReview
                            key={idx}
                            userImage={review.avatarUrl}
                            username={review.username}
                            rating={review.rating}
                            reviewText={review.text}
                        />
                    ))}
                    {/*
                    <BookReview 
                        userImage="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80" 
                        username="ReaderFan101" 
                        rating={4.5} 
                        reviewText="A truly captivating story. The world-building was incredible, though I felt the ending was a bit rushed. Still, a solid read!"
                    />
                    <BookReview 
                        username="CritiqueMaster" 
                        rating={3} 
                        reviewText="An interesting concept, but the execution fell a little flat for me. Some characters felt underdeveloped. It has potential but didn't quite hit the mark."
                    />
                    <BookReview 
                        userImage="" // This will use the default placeholder from BookReview
                        username="NewReader22" 
                        rating={5} 
                        // This will use the default reviewText from BookReview
                    />
                    */}
                    <div className="load-more-reviews">
                        <button className="btn">Look at more reviews...</button>
                    </div>
                </div>
            </div>

            {/* Similar Books Section */}

            <div className="container similar-books">
                <div className="section-title">Readers who liked this book enjoyed:</div>
                    <BookGalleryManager books={book.similarBooks} limit="4" ></BookGalleryManager>
                    <BookGalleryManager books={book.similarBooks} limit="4" ></BookGalleryManager>
                <div className="load-more">
                    <button className="btn">See more similar books...</button>
                </div>
            </div>
        </div>
    );
}