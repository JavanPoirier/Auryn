import promise from 'redux-promise-middleware';
import createDebounce from 'redux-debounced';
import thunk from 'redux-thunk';
import { rootReducer, StoreState } from './reducers';

import { configureStore, ConfigureStoreOptions, AnyAction } from '@reduxjs/toolkit';

export default configureStore({
  reducer: rootReducer,
  middleware: [createDebounce(), thunk, promise],
} as ConfigureStoreOptions<StoreState, AnyAction>);
