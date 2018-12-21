const apiKeyParam = 'api_key=7f5e61b6cef8643d2442344b45842192';

export const saveDetailsByIdAndType = (id, type) => (dispatch, getState) => {
  const { cacheReducer: { details: { cache, fetching } } } = getState();
  if (fetching) return dispatch({ type: 'NOOP' });

  const index = cache.findIndex(it => it.id === id && it.type === type);
  if (index !== -1) {
    return dispatch({
      type: 'CACHE_DETAILS',
      payload: Promise.resolve(),
      meta: {
        index,
      },
    });
  }

  return dispatch({
    type: 'CACHE_DETAILS',
    meta: {
      debounce: {
        time: 500,
        key: 'CACHE_DETAILS',
      },
    },
    payload: fetch(`http://api.themoviedb.org/3/${type}/${id}?append_to_response=similar,videos,credits&${apiKeyParam}`)
      .then(response => response.json())
      .then(json => {
        json.type = 'name' in json ? 'tv' : 'movie';
        json.youtubeId = json.videos.results.length ? json.videos.results[0].key : 'nO_DIwuGBnA';
        json.similar.results = json.similar.results.slice(0, 5).map(it => ({ ...it, key: it.id.toString() }));
        return json;
      }),
  });
};
