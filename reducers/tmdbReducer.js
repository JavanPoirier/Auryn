export default function tmdbReducer(state = { // eslint-disable-line max-lines-per-function
  discover: {
    data: [],
    fetching: false,
    fetched: false,
    error: null,
  },
  movies: {
    data: [],
    fetching: false,
    fetched: false,
    error: null,
  },
  tv: {
    data: [],
    fetching: false,
    fetched: false,
    error: null,
  },
  details: {
    data: {},
    cache: [],
    fetching: false,
    fetched: false,
    error: null,
  },
  search: {
    data: [],
    fetching: false,
    fetched: false,
    error: null,
  },
}, action) {
  switch (action.type) {
    case 'TMDB_DISCOVER_FULFILLED':
      return {
        ...state,
        discover: {
          data: action.payload,
          fetching: false,
          fetched: true,
        },
      };

    case 'TMDB_DISCOVER_REJECTED':
      return {
        ...state,
        discover: {
          fetching: false,
          error: action.payload,
        },
      };

    case 'TMDB_DISCOVER':
      return {
        ...state,
        discover: {
          fetching: true,
          fetched: false,
        },
      };

    case 'TMDB_MOVIES_FULFILLED':
      return {
        ...state,
        movies: {
          data: action.payload,
          fetching: false,
          fetched: true,
        },
      };

    case 'TMDB_MOVIES_REJECTED':
      return {
        ...state,
        movies: {
          fetching: false,
          error: action.payload,
        },
      };

    case 'TMDB_MOVIES':
      return {
        ...state,
        movies: { fetching: true, fetched: false },
      };

    case 'TMDB_TV_FULFILLED':
      return {
        ...state,
        tv: {
          data: action.payload,
          fetching: false,
          fetched: true,
        },
      };

    case 'TMDB_TV_REJECTED':
      return {
        ...state,
        tv: {
          fetching: false,
          error: action.payload,
        },
      };

    case 'TMDB_TV':
      return {
        ...state,
        tv: { fetching: true, fetched: false },
      };

    case 'TMDB_DETAILS_FULFILLED':
      const cache = [...state.details.cache];
      if (action.meta.cachehit) {
        const i = cache.findIndex(it => it.id === action.payload.id && it.type === action.payload.type);
        cache.splice(i, 1);
        cache.unshift(action.payload);
      } else
        cache.push(action.payload);

      if (cache.length > 20) cache.pop();
      return {
        ...state,
        details: {
          data: action.payload,
          cache,
          fetching: false,
          fetched: true,
        },
      };

    case 'TMDB_DETAILS_REJECTED':
      return {
        ...state,
        details: {
          fetching: false,
          error: action.payload,
        },
      };

    case 'TMDB_DETAILS':
      return {
        ...state,
        details: { fetching: true, fetched: false },
      };

    case 'TMDB_DETAILS_CLEAR':
    return {
      ...state,
      details: { asset: null },
    };

    case 'TMDB_SEARCH_FULFILLED':
      return {
        ...state,
        search: {
          data: action.payload,
          fetching: false,
          fetched: true,
        },
      };

    case 'TMDB_SEARCH_REJECTED':
      return {
        ...state,
        search: {
          fetching: false,
          error: action.payload,
        },
      };

    case 'TMDB_SEARCH':
      return {
        ...state,
        search: { fetching: true },
      };

    default:
      return state;
  }
}
