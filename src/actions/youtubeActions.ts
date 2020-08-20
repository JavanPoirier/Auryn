import Youtube from 'youtube-stream-url';
import { Dispatch } from 'redux';

interface YoutubeApiAction {
  type: 'YOUTUBE_VIDEO';
  payload: Promise<Youtube.YoutubeResponse>;
  meta: {
    debounce: {
      time: number;
    };
  };
}

interface YoutubeApiActionRejected {
  type: 'YOUTUBE_VIDEO_REJECTED';
  payload: Error;
}

interface YoutubeApiActionFulfilled {
  type: 'YOUTUBE_VIDEO_FULFILLED';
  payload: Youtube.YoutubeResponse;
}

export type YoutubeApiActions = YoutubeApiAction | YoutubeApiActionFulfilled | YoutubeApiActionRejected;

export const getVideoSourceByYoutubeId = (key: string) => (dispatch: Dispatch<YoutubeApiAction>) =>
  dispatch({
    type: 'YOUTUBE_VIDEO',
    meta: {
      debounce: {
        time: 500,
      },
    },
    payload: Youtube.getInfo({ url: `http://www.youtube.com/watch?v=${key}` }),
  });
