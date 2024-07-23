import React, { useState, useEffect } from 'react';
import Star from './Star';

const StarRating = ({ totalStars = 5, rating = 0, onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => {
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (index) => {
    onRate(index + 1);
  };

  useEffect(() => {
    setHoverRating(rating);
  }, [rating]);

  return (
    <div className='star-rating'>
      {[...Array(totalStars)].map((_, index) => (
        <Star
          key={index}
          filled={index < (hoverRating || rating)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

export default StarRating;
