import React from 'react';
import StarRating from './StarRating';

const MovieList = (props) => {
  const FavoriteComponent = props.favoriteComponent;

  const handleClick = (movie) => {
    console.log('Clicked movie:', movie);
    props.handleFavoritesClick(movie);
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
                  onRate={(rating) => props.updateRating(movie.title, rating)}
                />
              </div>
            )}
            <div onClick={() => handleClick(movie)}>
              <FavoriteComponent
                movie={movie}
                onAdd={props.onAdd}
                onRemove={props.onRemove}
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
