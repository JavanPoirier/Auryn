import { combineReducers } from 'redux';

import tmdbReducer from './tmdbReducer';
import pdpReducer from './pdpReducer';

export default combineReducers({
  tmdbReducer,
  pdpReducer,
});
