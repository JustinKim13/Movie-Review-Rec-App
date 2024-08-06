import React from 'react';
import StarRating from './StarRating';

const MovieList = (props) => {
  const FavoriteComponent = props.favoriteComponent;

  const handleRate = (title, rating, e) => {
    e.stopPropagation(); // Prevent multiple event triggers
    console.log(`Rating movie: ${title} with rating: ${rating}`); // Log title and rating
    props.updateRating(title, rating);
  };

  return (
    <>
      {props.movies.map((movie, index) => (
        <div className='image-container d-flex justify-content-start m-3' key={index}>
          <img src={movie.poster || movie.Poster || movie.Poster_Link} alt='movie' />
          <div className='overlay d-flex flex-column align-items-center justify-content-center'>
            {props.showRating && (
              <div className='star-rating'>
                <StarRating
                  rating={props.ratings[movie.title] || 0}
                  onRate={(rating, e) => handleRate(movie.title, rating, e)}
                />
              </div>
            )}
            <div onClick={(e) => { e.stopPropagation(); props.handleFavoritesClick(movie); }}>
              <FavoriteComponent
                movie={movie}
                onAdd={props.onAdd}
                onRemove={props.handleFavoritesClick} 
                title={movie.title}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default MovieList;
