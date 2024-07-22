import React from 'react';
import api from '../api';

const RemoveFromList = ({ imdbID, onRemove }) => {
  const handleRemove = async () => {
    try {
      await api.delete(`/api/movies/remove/${imdbID}/`);
      onRemove(imdbID);
    } catch (error) {
      console.error('Error removing movie from list:', error);
    }
  };

  return (
    <button onClick={handleRemove}>
      <span className='mr-2'>Remove</span>
    </button>
  );
};

export default RemoveFromList;
