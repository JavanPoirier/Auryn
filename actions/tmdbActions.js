import { chunk } from 'lodash';
import { youtubeVideo } from './youtubeActions';

const apiKeyParam = 'api_key=7f5e61b6cef8643d2442344b45842192';

const groupInto3 = array =>
  chunk(array, 3).map((data, index) => ({
    key: index.toString(),
    data,
  }));

const normalize = (array, imagePath = 'backdrop_path') =>
  array.filter(asset => asset.original_language === 'en' && asset[imagePath])
       .slice(0, 15)
       .map(it => ({ ...it, key: it.id.toString() }));

export const tmdbDiscover = () => dispatch => {
  let movies = [];

  dispatch({
    type: 'TMDB_DISCOVER',
    payload: fetch(`http://api.themoviedb.org/3/discover/movie?${apiKeyParam}`)
      .then(response => response.json())
      .then(json => {
        movies = json.results.slice(0, 12);
        return fetch(`http://api.themoviedb.org/3/discover/tv?${apiKeyParam}`);
      })
      .then(response => response.json())
      .then(tv => movies.concat(tv.results.slice(0, 12)).sort(() => 0.5 - Math.random()))
      .then(json => groupInto3(normalize(json))),
  });
};

export const tmdbMovies = () => dispatch => dispatch({
  type: 'TMDB_MOVIES',
  payload: fetch(`http://api.themoviedb.org/3/movie/popular?${apiKeyParam}`)
    .then(response => response.json())
    .then(json => normalize(json.results, 'poster_path')),
});

export const tmdbTv = () => dispatch => dispatch({
  type: 'TMDB_TV',
  payload: fetch(`http://api.themoviedb.org/3/tv/popular?${apiKeyParam}`)
    .then(response => response.json())
    .then(json => normalize(json.results)),
});

export const tmdbDetails = (id, type) => dispatch => {
  let details = {};

  dispatch({
    type: 'TMDB_DETAILS',
    payload: fetch(`http://api.themoviedb.org/3/${type}/${id}?append_to_response=similar,videos,credits&${apiKeyParam}`)
      .then(response => response.json())
      .then(json => {
        details = json;
        const key = details.videos.results.length ? details.videos.results[0].key : 'nO_DIwuGBnA';
        return dispatch(youtubeVideo(key));
      })
      .then(() => details),
  });
};
export const tmdbSearch = query => dispatch => dispatch({
  type: 'TMDB_SEARCH',
  payload: fetch(`http://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&${apiKeyParam}`)
    .then(response => response.json())
    .then(json => normalize(json.results)),
});

export const fetchPDPfromCache = id => dispatch => dispatch({
  type: 'FETCH_PDP_CACHE',
  payload: id,
});
