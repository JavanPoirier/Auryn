export default function cacheReducer(state = {
  details: {
    cache: [],
    fetching: false,
    fetched: false,
  },
}, action) {
  switch (action.type) {
    case 'CACHE_DETAILS_FULFILLED':
      const cache = [...state.details.cache];
      const { meta: { index } } = action;
      if (index >= 0) {
        const asset = cache[index];
        cache.splice(index, 1);
        cache.unshift(asset);
      } else
       cache.push(action.payload);

      if (cache.length > 20) cache.pop();

      return {
        ...state,
        details: {
          cache,
          fetching: false,
          fetched: true,
        },
      };

    case 'CACHE_DETAILS_REJECTED':
      return {
        ...state,
        details: {
          fetching: false,
        },
      };

    case 'CACHE_DETAILS':
      return {
        ...state,
        details: { fetching: true, fetched: false },
      };

    default:
      return state;
  }
}
