import { applyMiddleware, createStore } from 'redux';
import promise from 'redux-promise-middleware';
import createDebounce from 'redux-debounced';
import thunk from 'redux-thunk';

import reducer from './reducers';

const middleware = applyMiddleware(createDebounce(), thunk, promise());

export default createStore(reducer, middleware);
