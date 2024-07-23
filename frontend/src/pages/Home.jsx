import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';
import MovieList from '../components/MovieList';
import MovieListHeading from '../components/MovieListHeading';
import SearchBox from '../components/SearchBox';
import AddToList from '../components/AddToList';
import RemoveFromList from '../components/RemoveFromList';
import SortBar from '../components/SortBar';
import api from '../api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [ratings, setRatings] = useState({});
  const [sortOption, setSortOption] = useState('rating');

  const getMovieRequest = async (searchValue) => {
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=263d22d8`;
    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.Search) {
      setMovies(responseJson.Search);
    }
  };

  useEffect(() => {
    if (searchValue) {
      getMovieRequest(searchValue);
    }
  }, [searchValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resFavorites = await api.get('/api/movies/');
        setFavorites(resFavorites.data);

        const resRatings = await api.get('/api/movies/ratings/');
        const ratingsData = {};
        resRatings.data.forEach(rating => {
          ratingsData[rating.imdb_id] = rating.rating;
        });
        setRatings(ratingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const addFavoriteMovie = async (movie) => {
    const movieData = {
      imdb_id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      rated: movie.Rated,
      released: movie.Released,
      runtime: movie.Runtime,
      genre: movie.Genre,
      director: movie.Director,
      writer: movie.Writer,
      actors: movie.Actors,
      plot: movie.Plot,
      language: movie.Language,
      country: movie.Country,
      awards: movie.Awards,
      poster: movie.Poster,
      metascore: movie.Metascore,
      imdb_rating: movie.imdbRating,
      imdb_votes: movie.imdbVotes,
      type: movie.Type,
      dvd: movie.DVD,
      box_office: movie.BoxOffice,
      production: movie.Production,
      website: movie.Website,
      rating: 0 // Default rating value
    };

    try {
      const response = await api.post('/api/movies/add/', movieData);
      setFavorites((prevFavorites) => [...prevFavorites, response.data]);
    } catch (error) {
      console.error('Error adding movie to list:', error.response ? error.response.data : error);
    }
  };

  const removeFavoriteMovie = async (imdbID) => {
    try {
      console.log('Attempting to remove movie with ID:', imdbID);
      await api.delete(`/api/movies/remove/${imdbID}/`);
      setFavorites((prevFavorites) => prevFavorites.filter(movie => movie.imdb_id !== imdbID));
      console.log('Movie removed, updating state');
    } catch (error) {
      console.error('Error removing movie from list:', error);
    }
  };

  const updateRating = async (imdbID, rating) => {
    try {
      await api.post(`/api/movies/rate/${imdbID}/`, { rating });
      setRatings({ ...ratings, [imdbID]: rating });
    } catch (error) {
      console.error('Error rating movie:', error);
    }
  };

  const sortMovies = (movies, option) => {
    switch (option) {
      case 'rating':
        return [...movies].sort((a, b) => (ratings[b.imdb_id] || 0) - (ratings[a.imdb_id] || 0));
      case 'title':
        return [...movies].sort((a, b) => a.title.localeCompare(b.title));
      case 'year':
        return [...movies].sort((a, b) => b.year - a.year);
      default:
        return movies;
    }
  };

  useEffect(() => {
    console.log('Favorites updated:', favorites);
  }, [favorites]);

  return (
    <div className='container-fluid movie-app'>
      <div className='row d-flex align-items-center mt-4 mb-4'>
        <MovieListHeading heading='Search a Movie to Review' />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      <div className='row d-flex align-items-center mt-4 mb-4'>
        <div className='col'>
          <MovieListHeading heading='Your Movies' />
        </div>
        <div className='col-auto'>
          <SortBar sortOption={sortOption} setSortOption={setSortOption} />
        </div>
      </div>
      <div className='row'>
        <MovieList
          movies={sortMovies(movies, sortOption)}
          handleFavoritesClick={addFavoriteMovie}
          favoriteComponent={AddToList}
          showRating={false}
          ratings={ratings}
          updateRating={updateRating}
        />
      </div>
      <div className='row'>
        <MovieList
          movies={sortMovies(favorites, sortOption)}
          handleFavoritesClick={removeFavoriteMovie}
          favoriteComponent={RemoveFromList}
          showRating={true}
          ratings={ratings}
          updateRating={updateRating}
        />
      </div>
    </div>
  );
};

export default Home;
