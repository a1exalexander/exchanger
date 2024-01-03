import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { Provider } from 'react-redux';
import 'uikit/dist/css/uikit.min.css';
import { store, persistor } from './store';
import './scss/style.scss';
import ReactGA from 'react-ga';
import 'uikit/dist/js/uikit.min.js';
import * as serviceWorker from './serviceWorker';
import { PersistGate } from 'redux-persist/integration/react';

ReactGA.initialize('UA-148524615-1');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
