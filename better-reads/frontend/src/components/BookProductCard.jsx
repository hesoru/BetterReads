import React from 'react';
import StarRating from './ratings/starRating';
import { DetectiveDustyBlue, NoirNavy, NovellaNavy } from '../styles/colors';

const BookProductCard = ({
  imageUrl = 'https://via.placeholder.com/250x300.png?text=Book+Cover',
  title = 'Book Title Here - A Very Long Title That Will Hopefully Exceed Two Lines To Test Ellipsis',
  author = 'Author Name',
  rating = 0,
  price = '$0.00',
}) => {
  const cardStyle = {
    width: '250px',
    border: '1px solid #eee',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  };

  const imageStyle = {
    width: '100%',
    height: '300px',
    objectFit: 'cover', // As requested, can be changed to 'contain'
    display: 'block',
  };

  const detailsStyle = {
    backgroundColor: DetectiveDustyBlue,
    padding: '10px',
  };

  const titleStyle = {
    fontFamily: '"Merriweather", serif',
    fontSize: '18px',
    fontWeight: 'bold',
    color: NoirNavy,
    marginBottom: '5px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minHeight: '2.4em', // Approx 2 lines for 18px font with 1.3-1.4 line-height
    lineHeight: '1.3em',
  };

  const authorStyle = {
    fontFamily: '"Lato", sans-serif',
    fontSize: '14px',
    color: NovellaNavy,
    marginBottom: '8px',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minHeight: '1.2em', // Approx 1 line
    lineHeight: '1.2em',
  };

  const ratingPriceStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
  };

  const priceStyle = {
    fontFamily: '"Lato", sans-serif',
    fontSize: '16px',
    fontWeight: 'bold',
    color: NoirNavy,
  };

  return (
    <div style={cardStyle}>
      <img src={imageUrl} alt={`Cover of ${title}`} style={imageStyle} />
      <div style={detailsStyle}>
        <div title={title} style={titleStyle}>{title}</div>
        <div title={author} style={authorStyle}>{author}</div>
        <div style={ratingPriceStyle}>
          <StarRating rating={rating} />
          <div style={priceStyle}>{price}</div>
        </div>
      </div>
    </div>
  );
};

export default BookProductCard;
