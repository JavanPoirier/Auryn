const defaultVideoSource = {
  uri: 'http://www.streambox.fr/playlists/x31jrg1/x31jrg1.m3u8',
  type: 'HLS',
};

export default function youtubeReducer(state = { // eslint-disable-line max-lines-per-function
  videoSource: defaultVideoSource,
  fetching: false,
  fetched: false,
  error: null,
}, action) {
  switch (action.type) {
    case 'YOUTUBE_VIDEO':
      return {
        ...state,
        fetching: true,
      };
    case 'YOUTUBE_VIDEO_FULFILLED': {
      const format = action.payload.formats ?
        action.payload.formats.find(fmt => fmt.type.indexOf('mp4') > 0 && fmt.quality === 'hd720')
        : null;

      if (format) {
        return {
          ...state,
          videoSource: {
            uri: format.url,
            type: 'MP4',
          },
          fetching: false,
          fetched: true,
        };
      }

      // No viable format found
      return {
          ...state,
          videoSource: defaultVideoSource,
          fetching: false,
          fetched: true,
        };
    }
    case 'YOUTUBE_VIDEO_REJECTED':
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
