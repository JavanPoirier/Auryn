export default function moviesReducer(state={
  movies: {},
  fetching: false,
  fetched: false,
  error: null
}, action) {
  switch (action.type) {
    case 'FETCH_MOVIES_FULFILLED':
      return {...state, movies: action.payload, fetching: false, fetched: true}
    case 'FETCH_MOVIES_REJECTED':
      return {...state, fetching: false, error: action.payload}
    case 'FETCH_MOVIES':
      return {...state, fetching: true}
  }
  return state;
}
