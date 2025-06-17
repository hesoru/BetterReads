import React from 'react';
import './BookPage.css';
import { FavoriteIcon, GenreTags } from "./BookUtils.jsx";
import StarRating from '../ratings/starRating';
import {useNavigate} from "react-router-dom"; // Assuming starRating.jsx exports as default or named StarRating
import { useDispatch, useSelector } from 'react-redux';
import { addToBooklist, removeFromBooklist } from '../../redux/Booklist'; // adjust path if needed




export function BookPreview({isbn: bookId, coverUrl, title, rating, genres}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const booklist = useSelector((state) => state.booklist.items);
    const isFavorite = booklist.includes(bookId);

    const handleCardClick = () => {
        navigate(`/books/${bookId}`);
    };

    return (
        <div className="book-card">

            <FavoriteIcon isFavorite={isFavorite}
                          onClick={(e) => {
                              e.stopPropagation();
                              isFavorite
                                  ? dispatch(removeFromBooklist(bookId))
                                  : dispatch(addToBooklist(bookId));
                          }}/>
            <div className="card-clickable" onClick={handleCardClick} role="button" tabIndex={0}>
                <img src={coverUrl} alt={`${title} cover`} />
                <div className="card-content">
                    <div className="card-title">{title}</div>
                    <div className="card-rating">
                        <StarRating rating={rating} />
                        <span className="rating-value">{rating.toFixed(1)}</span>
                    </div>
                    <GenreTags genres={genres} />
                </div>
            </div>
        </div>
    );
}