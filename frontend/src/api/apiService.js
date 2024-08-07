import axios from 'axios';

const API_KEY = '239c2003688077508010e38517d69d63'; 
const BASE_URL = 'https://api.themoviedb.org/3';

// This is for our carousel of popular movies
const apiService = { 
  getPopularMovies: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  }
};

export default apiService;