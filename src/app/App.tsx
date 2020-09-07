import React, { useEffect, FC } from 'react';
import { connect } from 'react-redux';
import { fetchCurrencies } from '../store/actions';
import { HomePage } from '../pages';
import { AppFooter, AppHeader } from '../components';
import AppCarousel from '../components/carousel/AppCarousel';
import { ExchangesState } from '../store/types';
import { needUpdate } from '../utils/helpers';
import 'antd/es/select/style/css';
import 'antd/es/dropdown/style/css';
import 'antd/es/skeleton/style/css';
import 'antd/es/popover/style/css';

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
  const { method, exchange, lastUpdate, fetchCurrencies } = props;

  useEffect(() => {
    if (lastUpdate && needUpdate(lastUpdate)) fetchCurrencies();
  }, [lastUpdate, method, exchange, fetchCurrencies]);

  useEffect(() => {
    fetchCurrencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="app" className="app">
      <AppHeader />
      <HomePage />
      <AppCarousel className='app__carousel'/>
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
  { fetchCurrencies }
)(App);
