const apiKeyParam = 'api_key=7f5e61b6cef8643d2442344b45842192';

export const tmdbDiscover = () => dispatch => {
  let movies = [];

  dispatch({
    type: 'TMDB_DISCOVER',
    payload: fetch(`http://api.themoviedb.org/3/discover/movie?${apiKeyParam}`)
      .then(response => response.json())
      .then(json => {
        movies = json.results.slice(0, 10);
        return fetch(`http://api.themoviedb.org/3/discover/tv?${apiKeyParam}`);
      })
      .then(response => response.json())
      .then(json => movies.concat(json.results.slice(0, 10)).sort(() => 0.5 - Math.random())),
  });
};

export const tmdbMovies = () => dispatch => dispatch({
  type: 'TMDB_MOVIES',
  payload: fetch(`http://api.themoviedb.org/3/movie/top_rated?${apiKeyParam}`)
    .then(response => response.json()),
});

export const tmdbTv = () => dispatch => dispatch({
  type: 'TMDB_TV',
  payload: fetch(`http://api.themoviedb.org/3/tv/top_rated?${apiKeyParam}`)
    .then(response => response.json()),
});

export const tmdbMovieDetails = id => dispatch => dispatch({
  type: 'TMDB_MOVIE_DETAILS',
  payload: fetch(`http://api.themoviedb.org/3/movie/${id}?append_to_response=similar,videos&${apiKeyParam}`)
    .then(response => response.json()),
});


export const tmdbTvDetails = id => dispatch => dispatch({
  type: 'TMDB_TV_DETAILS',
  payload: fetch(`http://api.themoviedb.org/3/tv/${id}?append_to_response=similar,videos&${apiKeyParam}`)
    .then(response => response.json()),
});

export const tmdbSearch = query => dispatch => dispatch({
  type: 'TMDB_SEARCH',
  payload: fetch(`http://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&${apiKeyParam}`)
    .then(response => response.json()),
});

export const fetchPDPfromCache = id => dispatch => dispatch({
  type: 'FETCH_PDP_CACHE',
  payload: id,
});
