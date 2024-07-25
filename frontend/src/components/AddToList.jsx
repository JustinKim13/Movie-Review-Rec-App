import React from 'react';
import api from '../api';

const AddToList = ({ movie, onAdd }) => {
  const handleAdd = async () => {
    const movieData = {
      title: movie.Title || movie.Series_Title || movie.title, // Ensure title is set correctly
      year: movie.Year || movie.Released_Year || '',
      rated: movie.Rated || movie.Certificate || '',
      released: movie.Released || '',
      runtime: movie.Runtime || '',
      genre: movie.Genre || '',
      director: movie.Director || '',
      writer: movie.Writer || '',
      actors: movie.Actors || '',
      plot: movie.Plot || movie.Overview || '',
      language: movie.Language || '',
      country: movie.Country || '',
      awards: movie.Awards || '',
      poster: movie.Poster || movie.Poster_Link, // Ensure the correct field is mapped
      metascore: movie.Metascore || movie.Meta_score || '',
      imdb_rating: movie.imdbRating || movie.IMDB_Rating || '',
      imdb_votes: movie.imdbVotes || '',
      type: movie.Type || 'movie',
      dvd: movie.DVD || '',
      box_office: movie.BoxOffice || movie.Gross || '',
      production: movie.Production || '',
      website: movie.Website || '',
      rating: 0 // Default rating value
    };

    console.log('Movie data being sent:', movieData); // Log the movie data being sent

    try {
      console.log('Adding movie:', movieData); // Log the movie data being added
      const response = await api.post('/api/movies/add/', movieData);
      console.log('Movie added response:', response.data); // Log the response from the backend
      onAdd(response.data); // Ensure the response data is used for state update
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
