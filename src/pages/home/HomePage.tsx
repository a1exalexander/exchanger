import React from 'react';
import ExchangeCard from '../../components/exchange-card/ExchangeCard';
import SelectCard from '../../components/select-card/SelectCard';
// import RateChart from '../../components/RateChart';

const HomePage = () => {

  return (
    <div className='home-page'>
      <ExchangeCard className='home-page__exchange-card'/>
      <SelectCard />
      {/* TODO: CHART RATE */}
      {/* <RateChart /> */}
    </div>
  )
};

export default HomePage;
