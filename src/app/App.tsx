import React, { useEffect, FC } from "react";
import { connect } from "react-redux";
import { fetchCurrencies } from "../store/actions";
import { HomePage } from "../pages";
import AppHeader from "../components/header";
import AppCarousel from "../components/carousel/AppCarousel";
import "antd/es/select/style/css";
import "antd/es/dropdown/style/css";
import "antd/es/skeleton/style/css";
import "antd/es/popover/style/css";
import { ExchangesState } from "../store/types";
import { needUpdate } from "../utils/helpers";

interface IStateProps {
  lastUpdate: string;
  exchange: object;
  method: string;
}
interface IDispatchProps {
  fetchCurrencies: Function;
}

type IProps = IStateProps & IDispatchProps;

const App: FC<IProps> = props => {
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
      <div className="app__carousel">
        <AppCarousel />
      </div>
      <footer className="app__footer">
        <a href="#app" className="app__info-card">
          <h2 className="app__description">
            Конвертуй іноземну валюту та українську гривню за курсом{" "}
            <span className="app__description--eng">Monobank</span> та{" "}
            <span className="app__description--mark">НБУ</span>
          </h2>
        </a>
        {lastUpdate && (
          <div className="app__date-card">
            <span>Отсаннє оновлення:</span>{" "}
            <span className="app__date">{lastUpdate}</span>
          </div>
        )}
      </footer>
    </div>
  );
};

export default connect<IStateProps, IDispatchProps, object, ExchangesState>(
  ({ method, exchange, lastUpdate }) => ({
    method,
    exchange,
    lastUpdate
  }),
  { fetchCurrencies }
)(App);
