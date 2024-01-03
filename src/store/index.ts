import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import stringMiddleware from './middlewares/string.middleware';
import { trackingMiddleware } from './middlewares/tracking.middleware';


const persistConfig = {
  key: 'root',
  storage,
};

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  persistReducer(persistConfig, reducer),
  composeEnhancers(applyMiddleware(thunk, stringMiddleware, trackingMiddleware)),
);

export const persistor = persistStore(store);

export type AppState = ReturnType<typeof reducer>;
export type DispatchType = typeof store.dispatch;
