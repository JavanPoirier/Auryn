export default function tmdbReducer(state={
  discover: {
    data: [],
    fetching: false,
    fetched: false,
    error: null
  },
  movies: {
    data: [],
    fetching: false,
    fetched: false,
    error: null
  },
  tv: {
    data: [],
    fetching: false,
    fetched: false,
    error: null
  },
}, action) {
  switch (action.type) {
    case 'TMDB_DISCOVER_FULFILLED':
      return {...state, discover: {data: action.payload.results, fetching: false, fetched: true}}
    case 'TMDB_DISCOVER_REJECTED':
      return {...state, discover: {fetching: false, error: action.payload}}
    case 'TMDB_DISCOVER':
      return {...state, discover: {fetching: true}}

    case 'TMDB_MOVIES_FULFILLED':
      return {...state, movies: {data: action.payload.results, fetching: false, fetched: true}}
    case 'TMDB_MOVIES_REJECTED':
      return {...state, movies: {fetching: false, error: action.payload}}
    case 'TMDB_MOVIES':
      return {...state, movies: {fetching: true}}

    case 'TMDB_TV_FULFILLED':
      return {...state, tv: {data: action.payload.results, fetching: false, fetched: true}}
    case 'TMDB_TV_REJECTED':
      return {...state, tv: {fetching: false, error: action.payload}}
    case 'TMDB_TV':
      return {...state, tv: {fetching: true}}
  }
  return state;
}
