import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { Provider } from 'react-redux';
import 'uikit/dist/css/uikit.min.css';
import store from './store';
import './scss/style.scss';
import ReactGA from 'react-ga';
import 'uikit/dist/js/uikit.min.js';

ReactGA.initialize('UA-148524615-1');
ReactGA.pageview(window.location.pathname + window.location.search);

const RootApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const rootElement = document.getElementById('root');

if (rootElement && rootElement.hasChildNodes()) {
  ReactDOM.hydrate(<RootApp />, rootElement);
} else {
  ReactDOM.render(<RootApp />, rootElement);
}
