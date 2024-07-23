import React from 'react';
import api from '../api';

const RemoveFromList = ({ imdbID, onRemove }) => {
  const handleRemove = async () => {
    try {
      console.log('Attempting to remove movie with ID:', imdbID);
      const response = await api.delete(`/api/movies/remove/${imdbID}/`);
      console.log('API response for removal:', response.status);
      onRemove(imdbID);
    } catch (error) {
      console.error('Error removing movie from list:', error.response ? error.response.data : error);
    }
  };

  return (
    <button onClick={handleRemove}>
      <span className='mr-2'>Remove</span>
    </button>
  );
};

export default RemoveFromList;
