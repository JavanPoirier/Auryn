export default function pdpReducer(state={
  asset: false,
  cache: [],
  fetching: false,
  fetched: false,
  error: null
}, action) {
  switch (action.type) {
    case 'FETCH_PDP_FULFILLED':
      return {...state, asset: action.payload, fetching: false, fetched: true, cache: [...state.cache, action.payload]}
    case 'FETCH_PDP_REJECTED':
      return {...state, fetching: false, error: action.payload}
    case 'FETCH_PDP':
      return {...state, fetching: true}
    case 'FETCH_PDP_CACHE':
      let asset = state.cache.find(it=> action.payload == it.id)
      if (asset) {
        return {...state, asset: asset, fetched: true}
      }
      return {...state, fetched: false}

  }
  return state;
}
