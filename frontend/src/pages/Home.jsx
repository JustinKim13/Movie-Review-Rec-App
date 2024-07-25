import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';
import MovieList from '../components/MovieList';
import MovieListHeading from '../components/MovieListHeading';
import SearchBox from '../components/SearchBox';
import AddToList from '../components/AddToList';
import RemoveFromList from '../components/RemoveFromList';
import SortBar from '../components/SortBar';
import LoadingIndicator from '../components/LoadingIndicator';
import api from '../api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [ratings, setRatings] = useState({});
  const [sortOption, setSortOption] = useState('rating');
  const [loading, setLoading] = useState(false);

  const getMovieRequest = async (searchValue) => {
    const apiKey = '1d05ee91'; // Your actual API key
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=${apiKey}`;
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
        console.log('Fetching favorites...');
        const resFavorites = await api.get('/api/movies/');
        console.log('Favorites fetched:', resFavorites.data);
        setFavorites(resFavorites.data);

        console.log('Fetching ratings...');
        const resRatings = await api.get('/api/movies/ratings/');
        console.log('Ratings fetched:', resRatings.data);
        const ratingsData = {};
        resRatings.data.forEach(rating => {
          ratingsData[rating.title] = rating.rating;
        });
        setRatings(ratingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const addFavoriteMovie = (movieData) => {
    console.log('Adding favorite movie data:', movieData); // Log the movie data being added
    setFavorites((prevFavorites) => {
      const newFavorites = [...prevFavorites];
      const index = newFavorites.findIndex(m => m.title === movieData.title);
      if (index === -1) {
        newFavorites.push(movieData);
      }
      return newFavorites;
    });
    setRatings((prevRatings) => {
      console.log('Adding rating for:', movieData.title); // Log the title for which rating is being added
      return { ...prevRatings, [movieData.title]: 0 }; // Add default rating
    });
  };  

  const removeFavoriteMovie = async (title) => {
    try {
      const encodedTitle = encodeURIComponent(title);
      await api.delete(`/api/movies/remove/${encodedTitle}/`);
      setFavorites((prevFavorites) => prevFavorites.filter(movie => movie.title !== title));
      setRatings((prevRatings) => {
        const newRatings = { ...prevRatings };
        delete newRatings[title];
        return newRatings;
      });
    } catch (error) {
      console.error('Error removing movie from list:', error);
    }
  };

  const updateRating = async (title, rating) => {
    try {
      console.log(`Updating rating for ${title} to ${rating}`);
      await api.post(`/api/movies/rate/${encodeURIComponent(title)}/`, { rating });
      setRatings((prevRatings) => ({ ...prevRatings, [title]: rating }));
    } catch (error) {
      console.error('Error rating movie:', error);
    }
  };

  const sortMovies = (movies, option) => {
    switch (option) {
      case 'rating':
        return [...movies].sort((a, b) => (ratings[b.title] || 0) - (ratings[a.title] || 0));
      case 'title':
        return [...movies].sort((a, b) => a.title.localeCompare(b.title));
      case 'year':
        return [...movies].sort((a, b) => b.year - a.year);
      default:
        return movies;
    }
  };

  const refreshRecommendations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/movies/'); // Fetch user's movies
      const userMovies = res.data;

      if (userMovies.some(movie => movie.rating === null)) {
        alert("All movies must be rated to get recommendations.");
        setLoading(false);
        return;
      }

      // Send user movies to recommendation API
      const recommendationsRes = await api.post('/api/recommendations/', { movies: userMovies });
      setRecommendations(recommendationsRes.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container-fluid movie-app'>
      <div className='row d-flex align-items-center mt-4 mb-4'>
        <MovieListHeading heading='Search a Movie to Review' />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
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
          movies={sortMovies(favorites, sortOption)}
          handleFavoritesClick={removeFavoriteMovie}
          favoriteComponent={RemoveFromList}
          showRating={true}
          ratings={ratings}
          updateRating={updateRating}
        />
      </div>
      <div className='row d-flex align-items-center mt-4 mb-4'>
        <div className='col'>
          <MovieListHeading heading='Recommended Movies' />
        </div>
        <div className='col-auto'>
          <button className='btn btn-primary' onClick={refreshRecommendations} disabled={loading}>
            {loading ? <LoadingIndicator /> : 'Generate Recommendations'}
          </button>
        </div>
      </div>
      <div className='row'>
        <MovieList
          movies={sortMovies(recommendations, sortOption)}
          handleFavoritesClick={addFavoriteMovie}
          favoriteComponent={AddToList}
          showRating={false}
          ratings={ratings}
          updateRating={updateRating}
        />
      </div>
    </div>
  );
};

export default Home;
