import React, { useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrencies, loadMarketRates } from '../store/actions';
import { HomePage } from '../pages';
import { AppFooter, AppHeader, ScrollBackdrop } from '../components';
import AppCarousel from '../components/carousel/AppCarousel';
import { ExchangesState } from '../store/types';

const App: FC = () => {
  const dispatch = useDispatch<any>();
  const theme = useSelector((store: ExchangesState) => store.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0d111f' : '#ffffff');
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('no-transition');
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    dispatch(fetchCurrencies());
    // rates change during the day, refresh when the tab becomes visible again
    const onVisible = () => {
      if (document.visibilityState === 'visible') dispatch(loadMarketRates());
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [dispatch]);

  return (
    <div id="app" className="app">
      <h1 className="hidden-text">
        UAH USD EUR PLN BTC. Конвертер валют гривня долар євро обмінник.
        Currency converter hryvnia dollar euro exchanger. Конвертер валют
        гривня долар обмінник.
      </h1>
      <ScrollBackdrop />
      <AppHeader />
      <HomePage />
      <AppCarousel className="app__carousel" />
      <AppFooter />
    </div>
  );
};

export default App;
