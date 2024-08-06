import React from 'react';
import api from '../api';

const RemoveFromList = ({ movie, onRemove }) => {
  const handleRemove = async (e) => {
    e.stopPropagation(); // Prevent multiple event triggers
    try {
      const encodedTitle = encodeURIComponent(movie.title);
      console.log(`Attempting to remove movie with title: ${encodedTitle}`);
      const response = await api.delete(`/api/movies/remove/${encodedTitle}/`);
      console.log('API response for removal:', response.status);
      if (response.status === 204) {
        onRemove(movie.title); 
      }
    } catch (error) {
      console.error('Error removing movie from list:', error);
    }
  };

  return (
    <button className="remove-from-list-btn" onClick={handleRemove}>
      <span className='mr-2'>Remove from List</span>
    </button>
  );
};

export default RemoveFromList;
