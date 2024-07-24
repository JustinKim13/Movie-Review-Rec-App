import React from 'react';
import api from '../api';

const AddToList = ({ movie, onAdd }) => {
  const handleAdd = async () => {
    const movieData = {
      imdb_id: movie.IMDB_ID || movie.imdb_id, // Adjust this line
      title: movie.Series_Title,
      year: movie.Year || '',
      rated: movie.Rated || '',
      released: movie.Released || '',
      runtime: movie.Runtime || '',
      genre: movie.Genre || '',
      director: movie.Director || '',
      writer: movie.Writer || '',
      actors: movie.Actors || '',
      plot: movie.Plot || '',
      language: movie.Language || '',
      country: movie.Country || '',
      awards: movie.Awards || '',
      poster: movie.Poster_Link,
      metascore: movie.Meta_score || '',
      imdb_rating: movie.IMDB_Rating || '',
      imdb_votes: movie.No_of_Votes || '',
      type: movie.Type || 'movie',
      dvd: movie.DVD || '',
      box_office: movie.Gross || '',
      production: movie.Production || '',
      website: movie.Website || '',
      rating: 0 // Default rating value
    };

    try {
      const response = await api.post('/api/movies/add/', movieData);
      onAdd(response.data);
    } catch (error) {
      console.error('Error adding movie to list:', error.response ? error.response.data : error);
    }
  };

  return (
    <button onClick={handleAdd}>
      <span className='mr-2'>Add to List</span>
    </button>
  );
};

export default AddToList;
