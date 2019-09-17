import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchCurrencies } from '../store/actions'; 
import { HomePage } from '../pages';
import AppHeader from '../components/header';
import AppCarousel from '../components/carousel/AppCarousel';
import 'antd/es/select/style/css';
import 'antd/es/dropdown/style/css';
import 'antd/es/skeleton/style/css';

const App = ({ fetchCurrencies }: any) => {

  useEffect(() => {
    const fetchData = async () => {
      await fetchCurrencies();
    }
    fetchData();
  }, []);
  
  return (
    <div className="app">
      <AppHeader/>
      <HomePage/>
      <div className='app__carousel'>
        <AppCarousel/>
      </div>
    </div>
  );
};

const mapDispatchToProps: any = {
  fetchCurrencies
};

export default connect(null, mapDispatchToProps)(App);
