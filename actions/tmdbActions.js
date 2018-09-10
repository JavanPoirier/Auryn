const apiKeyParam = "api_key=7f5e61b6cef8643d2442344b45842192";

export function tmdbDiscover() {
  return (dispatch) => {
    dispatch({
      type: 'TMDB_DISCOVER',
      payload: fetch("http://api.themoviedb.org/3/discover/movie?" + apiKeyParam)
                .then(response => response.json())
    });
  }
}

export function tmdbMovies() {
  return (dispatch) => {
    dispatch({
      type: 'TMDB_MOVIES',
      payload: fetch("http://api.themoviedb.org/3/movie/top_rated?" + apiKeyParam)
                .then(response => response.json())
    });
  }
}

export function tmdbTv() {
  return (dispatch) => {
    dispatch({
      type: 'TMDB_TV',
      payload: fetch("http://api.themoviedb.org/3/tv/top_rated?" + apiKeyParam)
                .then(response => response.json())
    });
  }
}

export function tmdbMovieDetails(id) {
  return (dispatch) => {
    dispatch({
      type: 'TMDB_MOVIE_DETAILS',
      payload: fetch("http://api.themoviedb.org/3/movie/" + id + "?append_to_response=similar,videos&" + apiKeyParam)
                .then(response => response.json())
    });
  }
}

export function tmdbTvDetails(id) {
  return (dispatch) => {
    dispatch({
      type: 'TMDB_TV_DETAILS',
      payload: fetch("http://api.themoviedb.org/3/tv/" + id + "?append_to_response=similar,videos&" + apiKeyParam)
                .then(response => response.json())
    });
  }
}

export function tmdbSearch(query) {
  return (dispatch) => {
    dispatch({
      type: 'TMDB_SEARCH',
      payload: fetch("http://api.themoviedb.org/3/search/multi/" + encodeURIComponent(query) + "?" + apiKeyParam)
                .then(response => response.json())
    });
  }
}

export function fetchPDPfromCache(id) {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_PDP_CACHE',
      payload: id
    });
  }
}
