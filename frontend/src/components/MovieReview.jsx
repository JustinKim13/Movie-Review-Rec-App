// MovieReview.jsx
import React from 'react';
import StarRating from './StarRating';

const MovieReview = () => {
	const handleRating = (rating) => {
		console.log(`Rated ${rating} stars`);
		// You can save the rating to your state or send it to your backend here
	};

	return (
		<div className="movie-review">
			<h1>Rate this Movie</h1>
			<StarRating onRate={handleRating} />
		</div>
	);
};

export default MovieReview;
