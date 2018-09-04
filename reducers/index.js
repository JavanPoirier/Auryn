import { combineReducers } from 'redux'

import moviesReducer from './moviesReducer'
import pdpReducer from './pdpReducer'

export default combineReducers({
  moviesReducer,
  pdpReducer,
})
