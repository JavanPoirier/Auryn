export default function recommendationsReducer(state={
  asset: false,
  fetching: false,
  fetched: false,
  error: null
}, action) {
  switch (action.type) {
    case 'FETCH_RECOMMENDATIONS_FULFILLED':
      return {...state, asset: action.payload, fetching: false, fetched: true}
    case 'FETCH_RECOMMENDATIONS_REJECTED':
      return {...state, fetching: false, error: action.payload}
    case 'FETCH_RECOMMENDATIONS':
      return {...state, fetching: true}
  }
  return state;
}
