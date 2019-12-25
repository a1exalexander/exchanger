import React, { useEffect, FC } from "react";
import { connect } from "react-redux";
import { fetchCurrencies } from "../store/actions";
import { HomePage } from "../pages";
import AppHeader from "../components/header";
import AppCarousel from "../components/carousel/AppCarousel";
import "antd/es/select/style/css";
import "antd/es/dropdown/style/css";
import "antd/es/skeleton/style/css";
import { ExchangesState } from "../store/types";

interface IStateProps {
  lastUpdate: string;
}
interface IDispatchProps {
  fetchCurrencies: Function;
}

type IProps = IStateProps & IDispatchProps;

const App: FC<IProps> = props => {
  const { lastUpdate, fetchCurrencies } = props;

  useEffect(() => {
    const fetchData = async () => {
      await fetchCurrencies();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <AppHeader />
      <HomePage />
      <div className="app__carousel">
        <AppCarousel />
      </div>
      <footer className='app__footer'>
        {lastUpdate && (<div className="app__date-card">
          <span>Last update:</span>{' '}<span className='app__date'>{lastUpdate}</span>
        </div>)}
      </footer>
    </div>
  );
};

export default connect<IStateProps, IDispatchProps, object, ExchangesState>(
  ({ lastUpdate }) => ({ lastUpdate }),
  { fetchCurrencies }
)(App);
