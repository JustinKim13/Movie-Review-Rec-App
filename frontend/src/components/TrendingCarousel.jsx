import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import apiService from '../api/apiService';

const TrendingCarousel = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const popularMovies = await apiService.getPopularMovies();
      setMovies(popularMovies);
    };

    fetchMovies();
  }, []);

  return (
    <div className="carousel-container">
      <Carousel>
        {movies.map((movie) => (
          <Carousel.Item key={movie.id}>
            <img
              className="d-block w-100"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <Carousel.Caption>
              <h3>{movie.title}</h3>
              <p>{movie.overview}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default TrendingCarousel;
