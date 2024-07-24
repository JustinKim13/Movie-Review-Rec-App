import React from 'react';
import StarRating from './StarRating';
import api from '../api';

const MovieReview = ({ imdbID, onRate }) => {
  const handleRating = async (rating) => {
    try {
      await api.post(`/api/movies/rate/${imdbID}/`, { rating });
      onRate(imdbID, rating);
    } catch (error) {
      console.error('Error rating movie:', error);
    }
  };

  return (
    <div className="movie-review">
      <h1>Rate this Movie</h1>
      <StarRating onRate={handleRating} />
    </div>
  );
};

export default MovieReview;