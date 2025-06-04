import React from 'react';
import './BookPage.css';
import BookPreview from './BookPreview';
import {StarRating, GenreTags} from "./BookUtils.jsx";
import BookGalleryManager from "./BookGalleryManager.jsx";

// navLinks: [home: "/"],
// book: { coverUrl, author, publishYear, title, summary, isbn (key), genres: [], averageRating, reviews : [] }
// userReview: { avatarUrl, username }
// otherReviews: [ { id, username, avatarUrl, rating, text } ]
// similarBooks: [ { isbn, coverUrl, title, rating, averageRating, genres: [], isFavorite } ]
// onToggleFavorite: function(isbn)


export default function BookDetailsPage({ book, userReview, otherReviews, similarBooks }) {
    return (
        <div>
            {/* Header */}
            <header>
                <div className="logo">

                </div>
                <nav>
                    <a href="/">Home</a>
                    <a href="/browse">Browse Books</a>
                </nav>
                <img
                    src={userReview.avatarUrl}
                    alt="User Avatar"
                    className="user-avatar"
                />
            </header>


            <div className="container book-page">
                {/* Book Cover & Info */}
                <div className="book-cover-container">
                    <img
                        src={book.coverUrl}
                        alt={`${book.title} cover`}
                        className="book-cover"
                    />
                    <StarRating rating={Math.round(book.averageRating)} />
                    <button className="btn">Make Review</button>
                </div>

                <div className="book-info">
                    <h1 className="book-title">{book.title}</h1>
                    <p className="book-summary">{book.summary}</p>
                    <div className="isbn">ISBN: {book.isbn}</div>
                    <GenreTags genres={book.genres} />

                    {/* TODO: replace with ReviewCard */}
                    {/*
                    <div className="review-section">
                        <div className="section-title">Your review</div>
                        {userReview ? (
                            <div className="user-review">
                                <img
                                    src={userReview.avatarUrl}
                                    alt="Your avatar"
                                    className="avatar"
                                />
                                <span className="username">{userReview.username}</span>
                                <button className="btn btn-review">Edit Review</button>
                            </div>
                        ) : (
                            <button className="btn">Make a Review</button>
                        )}
                    </div>


                    <div className="other-reviews">
                        <div className="section-title">Review from other readers with similar taste</div>
                        {otherReviews.map((rev) => (
                            <div key={rev.id} className="review-card">
                                <img
                                    src={rev.avatarUrl}
                                    alt={`${rev.username} avatar`}
                                    className="avatar"
                                />
                                <div className="review-content">
                                    <div className="review-header">
                                        <span className="username">{rev.username}</span>
                                        <StarRating rating={rev.rating} />
                                    </div>
                                    <div className="review-text">{rev.text}</div>
                                </div>
                            </div>
                        ))}
                        <div className="load-more-reviews">
                            <button className="btn">Look at more reviews...</button>
                        </div>

                    </div>
                     */}
                </div>
            </div>

            {/* Similar Books Section */}

            <div className="container similar-books">
                <div className="section-title">Readers who liked this book enjoyed:</div>
                <BookGalleryManager books={similarBooks} limit="4" ></BookGalleryManager>

                <div className="load-more-books">
                    <button className="btn">See more similar books...</button>
                </div>
            </div>
        </div>
    );
}