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
    <Card sx={{
      width: '100%',
      maxWidth: { xs: 280, sm: 320, md: 345 },
      m: 'auto',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'center'
    }}>
      <CardActionArea onClick={handleCardClick} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 1 }}>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <CardMedia
            component="img"
            sx={{
              height: { xs: 200, sm: 225, md: 250 },
              objectFit: 'contain',
              width: '100%'
            }}
            image={coverUrl}
            alt={`${title} cover`}
          />
          <FavoriteIcon
            isFavorite={isFavorite}
            onClick={handleFavoriteClick}
            disabled={loading}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography gutterBottom variant="h6" component="div">
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
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