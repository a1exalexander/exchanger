import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';
import stringMiddleware from './middlewares/string-middleware';

declare global {
  interface Window { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any; }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk, stringMiddleware)));

export type AppState = ReturnType<typeof reducer>;
export default store;