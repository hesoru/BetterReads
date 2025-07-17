import React, {useEffect, useState, useRef} from 'react';
import './BookPage.css';
import {BookPreview} from './BookPreview';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Grid, Box, Typography, Button, CircularProgress } from '@mui/material';
import StarRating from '../ratings/starRating';
import BookReview from './bookReview.jsx';
import { GenreTags } from "./BookUtils.jsx";
import BookUtils from "../../utils/BookUtils.js";
import './BookPage.css';

const sectionTitleStyle = {
    fontFamily: 'Source Serif Pro, serif',
    fontStyle: 'italic',
    color: 'var(--color-primary)',
    fontSize: { xs: '1.5rem', md: '1.75rem' },
    marginBottom: 2,
    marginTop: 3,
};

const deleteButtonStyle = {
    backgroundColor: 'transparent',
    border: '1px solid #D32F2F',
    color: '#D32F2F',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontFamily: 'Albert Sans, sans-serif',
    fontStyle: 'italic',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: '#D32F2F',
        color: '#FFFFFF',
    },
};

const buttonStyle = {
    backgroundColor: 'transparent',
    border: '1px solid #151B54',
    color: '#151B54',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontFamily: 'Albert Sans, sans-serif',
    fontStyle: 'italic',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: '#151B54',
        color: '#FFFFFF',
    },
};

export default function BookDetailsPage() {
    const { bookId } = useParams();
    const username = useSelector((state) => state.user?.user?.username);
    const reviewRef = useRef(null);
    const userAvatar = useSelector((state) => state.user?.user?.avatarUrl);
    const isGuest = useSelector((state) => state.user?.isGuest);
    console.log("bookId", bookId);

    const [book, setBook] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userReview, setUserReview] = useState(null);
    const [bookReviews, setBookReviews] = useState([]);
    const [reviewsToShow, setReviewsToShow] = useState(3);
    const [avatarMap, setAvatarMap] = useState({});
    const [loading, setLoading] = useState(true);

    const handleScrollToReview = () => {
        reviewRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const bookData = await BookUtils.getBookById(bookId);
                const review = await BookUtils.getUserReview(bookId, username);
                const allReviews = await BookUtils.getBookReviews(bookId);
              
                // Ore was here
                console.log("review", review);
                console.log("all reviews", allReviews);
                const otherReviews = allReviews.filter(r => r.userId !== username);
                console.log("other reviews", otherReviews); 
                // Non-ore touched
                setBook(bookData);
                setUserReview(review);
                setBookReviews(otherReviews);
            } catch (err) {
                console.error('Failed to fetch book data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (bookId) {
            fetchData();
        }
    }, [bookId, username]);

    useEffect(() => {
        const fetchAvatars = async () => {
            const map = {};
            await Promise.all(
                bookReviews.map(async (review) => {
                    if (review.userId) {
                        const avatar = await BookUtils.getUserAvatar(review.userId);
                        map[review.userId] = avatar;
                    }
                })
            );
            setAvatarMap(map);
        };

        if (bookReviews.length > 0) {
            fetchAvatars();
        }
    }, [bookReviews]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!book) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Book not found.</Typography>;

    return (
        <Container sx={{ py: { xs: 2, md: 4 } }}>
            <div className="book-details-layout">
                <div className="book-cover-column">
                    <Box
                        component="img"
                        src={book.image}
                        alt={`${book.title} cover`}
                        sx={{
                            width: '100%',
                            maxWidth: '300px',
                            borderRadius: '12px',
                            boxShadow: '4px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                            objectFit: 'cover',
                        }}
                    />
                    <StarRating rating={Math.round(book.averageRating)} />
                    <div className="load-more">
                        <button className="btn" onClick={handleScrollToReview}>Make Review</button>
                    </div>
                </div>
                <div className="book-info-column">
                    <Typography variant="h3" component="h1" className="book-title" sx={{ fontWeight: 'bold', mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                        {book.title}
                    </Typography>
                    <Typography sx={{ color: 'var(--color-text-light)', mb: 2 }}>
                        {book.description}
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: 'var(--color-text-light)', mb: 2 }}>
                        ISBN: {book.ISBN}
                    </Typography>
                    <GenreTags genres={book.genre} />
                </div>
            </div>

            <div className="reviews-container">
                {!isGuest && (
                    <div className="review-section" ref={reviewRef}>
                        <div className="section-title">Your Review</div>

                        <BookReview
                            editable={isEditing || !userReview}
                            userImage={userAvatar}
                            username={username}
                            rating={userReview?.rating}
                            reviewText={userReview?.description}
                            onSave={async ({ rating, description }) => {
                                const newReview = await BookUtils.upsertReview(bookId, username, { rating, description });
                                setUserReview(newReview);
                                setBookReviews(prev => {
                                    const others = prev.filter(r => r.userId !== username);
                                    return [newReview, ...others];
                                });
                                setIsEditing(false);
                            }}
                        />
                                                                        {userReview && !isEditing && (
                            <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-start' }}>
                                <Button sx={buttonStyle} onClick={() => setIsEditing(true)}>
                                    Edit Review
                                </Button>
                                <Button sx={deleteButtonStyle} onClick={() => console.log('Delete review clicked')}>
                                    Delete Review
                                </Button>
                            </Box>
                        )}
                    </div>
                )}


                <Box sx={{ mt: 4 }}>
                    <Typography sx={sectionTitleStyle}>Reviews from Other Readers</Typography>
                    {bookReviews.slice(0, reviewsToShow).map((review, idx) => (
                        <BookReview
                            key={idx}
                            userImage={avatarMap[review.userId]}
                            username={review.userId}
                            rating={review.rating}
                            reviewText={review.description}
                        />
                    ))}
                    {bookReviews.length > reviewsToShow && bookReviews.length > 3 && (
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button sx={buttonStyle} onClick={() => setReviewsToShow(prev => prev + 10)}>Look at more reviews...</Button>
                        </Box>
                    )}
                </Box>
            </div>
        </Container>
    );
}