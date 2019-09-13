import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchCurrencies } from '../store/actions'; 
import { HomePage } from '../pages';
import AppHeader from '../components/header';
import 'antd/es/select/style/css';
import 'antd/es/dropdown/style/css';
import 'antd/es/skeleton/style/css';
import { ActionTypes } from '../store/types';

const App = ({ fetchCurrencies }: any) => {

  useEffect(() => {
    const fetchData = async () => {
      await fetchCurrencies();
    }
    fetchData();
  }, []);
  
  return (
    <div className="App">
      <AppHeader/>
      <HomePage/>
    </div>
  );
};

const mapDispatchToProps: any = {
  fetchCurrencies
};

export default connect(null, mapDispatchToProps)(App);
