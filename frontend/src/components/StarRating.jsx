import React, { useState, useEffect } from 'react';
import Star from './Star';

const StarRating = ({ totalStars = 5, rating = 0, onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => {
    console.log(`Mouse enter on star ${index + 1}`);
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    console.log('Mouse leave');
    setHoverRating(0);
  };

  const handleClick = (index, e) => {
    e.stopPropagation(); // Prevent multiple event triggers
    console.log(`Star clicked: ${index + 1}`);
    onRate(index + 1, e);
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
          onClick={(e) => handleClick(index, e)}
        />
      ))}
    </div>
  );
};

export default StarRating;
