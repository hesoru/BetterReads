import React, {useEffect, useState, useRef} from 'react';
import './BookPage.css';
import {BookPreview} from './BookPreview';
import { GenreTags } from "./BookUtils.jsx";
import StarRating from '../ratings/starRating'; // Assuming starRating.jsx exports as default or named StarRating
import BookGalleryManager from "./BookGalleryManager.jsx";
import BookReview from './bookReview.jsx'; // Assuming bookReview.jsx exports as default
//import sampleData from "../../sampleData2.json";
import {useParams} from "react-router-dom";
import BookUtils from "../../utils/BookUtils.js";
import {useSelector} from "react-redux";


export default function BookDetailsPage( ) {
    const  {bookId}  = useParams();
    const userId = useSelector((state) => state.user?.user?._id);
    const username = useSelector((state) => state.user?.user?.username);
    const reviewRef = useRef(null);

    //console.log("username", username);
    //console.log("userId", userId);
   console.log("bookId", bookId);
    const userAvatar = useSelector((state) => state.user?.user?.avatarUrl);

    const [book, setBook] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userReview, setUserReview] = useState(null);
    const [bookReviews, setBookReviews] = useState([]);
    const [avatarMap, setAvatarMap] = useState({});


    const handleScrollToReview = () => {
        reviewRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookData = await BookUtils.getBookById(bookId);
                const review = await BookUtils.getUserReview(bookId, username);
                const allReviews = await BookUtils.getBookReviews(bookId);

                console.log("review", review);
                console.log("all reviews", allReviews);
                const otherReviews = allReviews.filter(r => r.userId !== username);
                console.log("other reviews", otherReviews);

                setBook(bookData);
                setUserReview(review);
                setBookReviews(otherReviews);
            } catch (err) {
                console.error('Failed to fetch book data:', err);
            }
        };

        if (bookId) {
            fetchData();
        }
    }, [bookId, userId]);

    useEffect(() => {
        const fetchAvatars = async () => {
            const map = {};

            await Promise.all(
                bookReviews.map(async (review) => {
                    const avatar = await BookUtils.getUserAvatar(review.userId);
                    map[review.userId] = avatar;
                })
            );

            setAvatarMap(map);
        };

        if (bookReviews.length > 0) {
            fetchAvatars();
        }
    }, [bookReviews]);

    if (!book) return <div>Loading...</div>;

    return (
        <div>
            <div className="container book-page">
                {/* Book Cover & Info */}
                <div className="book-cover-container">
                    <img
                        src={book.image}
                        alt={`${book.title} cover`}
                        className="book-cover"
                    />
                    <StarRating rating={Math.round(book.averageRating)} />
                    <div className="load-more">
                        <button className="btn" onClick={handleScrollToReview}>Make Review</button>
                    </div>

                </div>

                <div className="book-info">
                    <h1 className="book-title">{book.title}</h1>
                    <p className="book-summary">{book.description}</p>
                    <div className="isbn">ISBN: {book.ISBN}</div>
                    <GenreTags genres={book.genre} />



                </div>
            </div>

            <div className="reviews-container">
                <div className="review-section" ref={reviewRef}>
                    <div className="section-title">Your Review</div>
                    <BookReview
                        editable={isEditing || !userReview}
                        userImage={userAvatar}
                        username={username}
                        rating={userReview?.rating}
                        reviewText={userReview?.description}
                        onSave={async ({ rating, description }) => {
                            const newReview = await BookUtils.upsertReview(bookId, username, {
                                rating,
                                description
                            });
                            setUserReview(newReview);
                            setBookReviews(prev => {

                                const others = prev.filter(r => r.userId !== username);
                                console.log("others", others);
                                console.log("username", username);
                                return [newReview, ...others];
                            });
                            setIsEditing(false);
                        }}
                    />

                    {userReview && !isEditing && (
                        <button className="btn" onClick={() => setIsEditing(true)}>
                            Edit Review
                        </button>
                    )}

                </div>

                <div className="other-reviews">
                    <div className="section-title">Reviews from Other Readers</div>
                    {bookReviews.map((review, idx) => (
                        <BookReview
                            key={idx}
                            userImage={avatarMap[review.userId]}
                            username={review.userId}
                            rating={review.rating}
                            reviewText={review.description}
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

            {/*<div className="container similar-books">*/}
            {/*    <div className="section-title">Readers who liked this book enjoyed:</div>*/}
            {/*        <BookGalleryManager books={book.similarBooks} limit="4" ></BookGalleryManager>*/}
            {/*        <BookGalleryManager books={book.similarBooks} limit="4" ></BookGalleryManager>*/}
            {/*    <div className="load-more">*/}
            {/*        <button className="btn">See more similar books...</button>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}