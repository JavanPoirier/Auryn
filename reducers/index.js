import { combineReducers } from 'redux'

import moviesReducer from './moviesReducer'
import recommendationsReducer from './recommendationsReducer'

export default combineReducers({
  moviesReducer,
  recommendationsReducer
})
