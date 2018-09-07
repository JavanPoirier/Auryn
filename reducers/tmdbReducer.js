export default function tmdbReducer(state={
  discover: {
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
  }
  return state;
}
