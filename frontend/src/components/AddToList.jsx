import React from 'react';
import api from '../api';

const AddToList = ({ movie, onAdd }) => {
  const handleAdd = async () => {
    const movieData = {
      title: movie.Title,
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
      poster: movie.Poster,
      metascore: movie.Metascore || '',
      imdb_rating: movie.imdbRating || '',
      imdb_votes: movie.imdbVotes || '',
      type: movie.Type || 'movie',
      dvd: movie.DVD || '',
      box_office: movie.BoxOffice || '',
      production: movie.Production || '',
      website: movie.Website || '',
      rating: 0 // Default rating value
    };

    try {
      console.log('Adding movie:', movieData); // Log the movie data being added
      await api.post('/api/movies/add/', movieData);
      onAdd(movieData); // Call the onAdd function with the movie data
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
