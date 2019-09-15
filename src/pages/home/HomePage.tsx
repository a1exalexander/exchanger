import React from 'react';
import ExchangeCard from '../../components/exchange-card/ExchangeCard';
import SelectCard from '../../components/select-card/SelectCard';

const HomePage = () => {

  return (
    <div className='home-page'>
      <ExchangeCard className='home-page__exchange-card'/>
      <SelectCard/>
    </div>
  )
};

export default HomePage;
