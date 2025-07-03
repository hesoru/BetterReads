import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { FavoriteIcon, GenreTags } from './BookUtils.jsx';
import StarRating from '../ratings/starRating';
import { addToBookListThunk, removeFromBookListThunk } from '../../redux/BooklistThunks.js';

export function BookPreview({ bookId, coverUrl, title, rating, genres }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.user._id);
  const booklist = useSelector((state) => state.booklist.items);
  const isFavorite = booklist.includes(bookId);
  const [loading, setLoading] = useState(false);

  const handleCardClick = () => {
    navigate(`/books/${bookId}`);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const thunk = isFavorite ? removeFromBookListThunk : addToBookListThunk;
      await dispatch(thunk({ userId, bookId })).unwrap();
    } catch (error) {
      console.error('Failed to update favorite status:', error);
      alert('Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 345, m: 'auto', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <FavoriteIcon
        isFavorite={isFavorite}
        onClick={handleFavoriteClick}
        disabled={loading}
      />
      <CardActionArea onClick={handleCardClick} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1}}>
        <CardMedia
          component="img"
          sx={{ height: 250, objectFit: 'contain', pt: 2 }}
          image={coverUrl}
          alt={`${title} cover`}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" sx={{minHeight: '64px'}}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <StarRating rating={rating} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {rating.toFixed(1)}
            </Typography>
          </Box>
          <GenreTags genres={genres} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}