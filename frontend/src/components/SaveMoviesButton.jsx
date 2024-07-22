import React from 'react';
import api from '../api';

const SaveMoviesButton = ({ movies, onSave }) => {
  const handleSave = async () => {
    try {
      const response = await api.post('/api/movies/save/', { movies });
      onSave(response.data);
    } catch (error) {
      console.error('Error saving movies:', error);
    }
  };

  return (
    <button onClick={handleSave}>
      <span className='mr-2'>Save Movies</span>
    </button>
  );
};

export default SaveMoviesButton;
