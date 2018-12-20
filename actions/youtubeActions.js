import Youtube from 'youtube-stream-url';

export const youtubeVideo = key => dispatch => dispatch({
  type: 'YOUTUBE_VIDEO',
  meta: {
    debounce: {
      time: 500,
    },
  },
  payload: Youtube.getInfo({ url: `http://www.youtube.com/watch?v=${key}` }),
});
