import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import App from '../app';
import { store } from '../store';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('App tests', () => {
  beforeAll(() => {
    window.matchMedia =
      window.matchMedia ||
      ((query: string) =>
        ({
          matches: false,
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        } as any));
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    act(() => {
      root.render(
        <Provider store={store}>
          <App />
        </Provider>,
      );
    });
    expect(div.querySelector('.exchange-card')).not.toBeNull();
    act(() => root.unmount());
  });
});
