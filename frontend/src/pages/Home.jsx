import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';
import MovieList from '../components/MovieList';
import MovieListHeading from '../components/MovieListHeading';
import SearchBox from '../components/SearchBox';
import AddToList from '../components/AddToList';
import RemoveFromList from '../components/RemoveFromList';

const App = () => {
	const [movies, setMovies] = useState([]);
	const [favorites, setFavorites] = useState([]);
	const [searchValue, setSearchValue] = useState('');
	const [ratings, setRatings] = useState({});

	const getMovieRequest = async (searchValue) => {
		const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=263d22d8`;

		const response = await fetch(url);
		const responseJson = await response.json();

		if (responseJson.Search) {
			setMovies(responseJson.Search);
		}
	};

	useEffect(() => {
		getMovieRequest(searchValue);
	}, [searchValue]);

	useEffect(() => {
		const movieFavorites = JSON.parse(localStorage.getItem('react-movie-app-favorites'));
		const movieRatings = JSON.parse(localStorage.getItem('react-movie-app-ratings'));

		if (movieFavorites) {
			setFavorites(movieFavorites);
		}
		if (movieRatings) {
			setRatings(movieRatings);
		}
	}, []);

	const saveToLocalStorage = (items, key) => {
		localStorage.setItem(key, JSON.stringify(items));
	};

	const addFavoriteMovie = (movie) => {
		const newFavoriteList = [...favorites, movie];
		setFavorites(newFavoriteList);
		saveToLocalStorage(newFavoriteList, 'react-movie-app-favorites');
	};

	const removeFavoriteMovie = (movie) => {
		const newFavoriteList = favorites.filter((favorite) => favorite.imdbID !== movie.imdbID);

		setFavorites(newFavoriteList);
		saveToLocalStorage(newFavoriteList, 'react-movie-app-favorites');
	};

	const updateRating = (imdbID, rating) => {
		const newRatings = { ...ratings, [imdbID]: rating };
		setRatings(newRatings);
		saveToLocalStorage(newRatings, 'react-movie-app-ratings');
	};

	return (
		<div className='container-fluid movie-app'>
			<div className='row d-flex align-items-center mt-4 mb-4'>
				<MovieListHeading heading='Search a Movie to Review' />
				<SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
			</div>
			<div className='row'>
				<MovieList
					movies={movies}
					handleFavoritesClick={addFavoriteMovie}
					favoriteComponent={AddToList}
					showRating={false}
					ratings={ratings}
					updateRating={updateRating}
				/>
			</div>
			<div className='row d-flex align-items-center mt-4 mb-4'>
				<MovieListHeading heading='Your Movies' />
			</div>
			<div className='row'>
				<MovieList
					movies={favorites}
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

export default App;
