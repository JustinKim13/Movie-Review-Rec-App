import React from 'react';
import StarRating from './StarRating';

const MovieList = (props) => {
	const FavoriteComponent = props.favoriteComponent;

	return (
		<>
			{props.movies.map((movie, index) => (
				<div className='image-container d-flex justify-content-start m-3' key={index}>
					<img src={movie.Poster} alt='movie' />
					<div
						className='overlay d-flex flex-column align-items-center justify-content-center'
					>
						<div onClick={() => props.handleFavoritesClick(movie)}>
							<FavoriteComponent />
						</div>
						{props.showRating && (
							<div className='star-rating'>
								<StarRating
									rating={props.ratings[movie.imdbID] || 0}
									onRate={(rating) => props.updateRating(movie.imdbID, rating)}
								/>
							</div>
						)}
					</div>
				</div>
			))}
		</>
	);
};

export default MovieList;
