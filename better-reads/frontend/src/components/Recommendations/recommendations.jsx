import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './recommendations.css';

const Recommendations = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const { userId } = useParams();

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/recommend/${userId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.status}`);
        }
        
        const data = await response.json();
        setBooks(data.books || []);
        setMessage(data.message || '');
        
        if (data.books.length === 0) {
          console.log('No recommendations found');
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err.message || 'Failed to load recommendations');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    
    if (userId) {
      fetchRecommendations();
    }
  }, [userId]);
  
  if (loading) {
    return (
      <div className="recommendations-container loading">
        <div className="loading-spinner"></div>
        <p>Finding books just for you...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="recommendations-container error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }
  
  return (
    <div className="recommendations-container">
      <h2>Recommended for You</h2>
      {message && <p className="recommendation-message">{message}</p>}
      
      {books.length === 0 ? (
        <div className="no-recommendations">
          <p>No recommendations available yet.</p>
          <p>Try rating more books to get personalized suggestions!</p>
        </div>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book._id} className="book-card">
              <img 
                src={book.image || '/default-book-cover.jpg'} 
                alt={`${book.title} cover`} 
                className="book-cover"
              />
              <div className="book-info">
                <h3>{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <div className="book-rating">
                  <span className="stars">{'★'.repeat(Math.round(book.averageRating))}</span>
                  <span className="rating-count">({book.ratingsCount})</span>
                </div>
                <div className="book-genres">
                  {book.genre.slice(0, 2).map((genre, index) => (
                    <span key={index} className="genre-tag">{genre}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;