import React, { useEffect, FC } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { fetchCurrencies } from "../store/actions";
import { HomePage } from "../pages";
import AppHeader from "../components/header";
import AppCarousel from "../components/carousel/AppCarousel";
import "antd/es/select/style/css";
import "antd/es/dropdown/style/css";
import "antd/es/skeleton/style/css";
import { ExchangesState } from "../store/types";
import moment from "moment";
import { needUpdate } from "../utils/helpers";

interface IStateProps {
  lastUpdate: string;
  computedCurrency: object;
  exchange: object;
  method: string;
  loading: boolean;
}
interface IDispatchProps {
  fetchCurrencies: Function;
}

type IProps = IStateProps & IDispatchProps;

const App: FC<IProps> = props => {
  const { loading, method, computedCurrency, exchange, lastUpdate, fetchCurrencies } = props;

  useEffect(() => {
    if (needUpdate(lastUpdate)) fetchCurrencies();
  });

  useEffect(() => {
    console.log(lastUpdate)
    if (needUpdate(lastUpdate)) fetchCurrencies();
  }, [lastUpdate, method, computedCurrency, fetchCurrencies, exchange]);

  useEffect(() => {
    fetchCurrencies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extra = () => {
    if (
      moment(lastUpdate, "DD.MM.YYYY hh:mm").isValid() &&
      moment().diff(moment(lastUpdate, "DD.MM.YYYY hh:mm"), "hours") > 1
    ) {
      return (
        <button className={classNames("update-button", { loading })}>
          {loading ? "loading" : "Update exchange rates"}
        </button>
      );
    } else if (lastUpdate) {
      return (
        <div className="app__date-card">
          <span>Last update:</span>{" "}
          <span className="app__date">{lastUpdate}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="app">
      <AppHeader />
      <HomePage />
      <div className="app__carousel">
        <AppCarousel />
      </div>
      <footer className="app__footer">{extra()}</footer>
    </div>
  );
};

export default connect<IStateProps, IDispatchProps, object, ExchangesState>(
  ({ computedCurrency, method, exchange, lastUpdate, loading }) => ({ method, computedCurrency, exchange, lastUpdate, loading }),
  { fetchCurrencies }
)(App);
