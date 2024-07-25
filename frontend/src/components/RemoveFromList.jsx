import React from 'react';
import api from '../api';

const RemoveFromList = ({ title, onRemove }) => {
  const handleRemove = async () => {
    try {
      const encodedTitle = encodeURIComponent(title); // Encode the title
      console.log('Attempting to remove movie with title:', encodedTitle);
      const response = await api.delete(`/api/movies/remove/${encodedTitle}/`);
      console.log('API response for removal:', response.status);
      onRemove(title);
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
