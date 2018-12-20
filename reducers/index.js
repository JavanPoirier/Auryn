import { combineReducers } from 'redux';

import tmdbReducer from './tmdbReducer';
import youtubeReducer from './youtubeReducer';
import cacheReducer from './cacheReducer';

export default combineReducers({
  tmdbReducer,
  youtubeReducer,
  cacheReducer,
});
