import React, { useEffect, FC } from 'react';
import { connect } from 'react-redux';
import { fetchCurrencies } from '../store/actions';
import { HomePage } from '../pages';
import { AppFooter, AppHeader, ScrollBackdrop } from '../components';
import AppCarousel from '../components/carousel/AppCarousel';
import { ExchangesState } from '../store/types';
import 'antd/es/select/style/css';
import 'antd/es/dropdown/style/css';
import 'antd/es/skeleton/style/css';
import 'antd/es/popover/style/css';
import 'antd/es/switch/style/css';
import { useSelector } from 'react-redux';

interface IStateProps {
  lastUpdate: string;
  exchange: object;
  method: string;
}
interface IDispatchProps {
  fetchCurrencies: Function;
}

type IProps = IStateProps & IDispatchProps;

const App: FC<IProps> = (props) => {
  const { fetchCurrencies } = props;
  const theme = useSelector((store: ExchangesState) => store.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    setTimeout(() => {
      document.documentElement.classList.remove('no-transition');
    }, 300);
  }, []);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return (
    <div id="app" className="app">
      <h1 className="hidden-text">
        UAH USD EUR BTC RUB.Конвертер валют гривна доллар обменник. Currency
        converter hryvnia dollar exchanger. Конвертер валют гривня долар
        обмінник.
      </h1>
      <ScrollBackdrop />
      <AppHeader />
      <HomePage />
      <AppCarousel className="app__carousel" />
      <AppFooter />
    </div>
  );
};

export default connect<IStateProps, IDispatchProps, object, ExchangesState>(
  ({ method, exchange, lastUpdate }) => ({
    method,
    exchange,
    lastUpdate,
  }),
  { fetchCurrencies },
)(App);
