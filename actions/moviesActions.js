export function fetchMovies() {
  return (dispatch) => {
    dispatch({
      type: 'FETCH_MOVIES',
      payload: fetch("http://api.themoviedb.org/3/discover/movie?api_key=7f5e61b6cef8643d2442344b45842192&language=en")
                .then(response => response.json())
    });
  }
}
