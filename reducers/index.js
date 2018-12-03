import { combineReducers } from 'redux';

import tmdbReducer from './tmdbReducer';
import youtubeReducer from './youtubeReducer';


export default combineReducers({
  tmdbReducer,
  youtubeReducer,
});
