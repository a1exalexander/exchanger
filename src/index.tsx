import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { Provider } from 'react-redux';
import store from './store';
import './scss/style.scss';
import ReactGA from 'react-ga';
import 'uikit/dist/js/uikit.min.js';
import 'uikit/dist/css/uikit.min.css';

ReactGA.initialize('UA-148524615-1');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
