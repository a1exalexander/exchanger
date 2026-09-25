import React from 'react';
import ExchangeCard from '../../components/exchange-card/ExchangeCard';
import { QuickPick } from '../../components/quick-pick';

const HomePage = () => (
  <main className="home-page">
    <ExchangeCard className="home-page__exchange-card" />
    <QuickPick className="home-page__quick-pick" />
  </main>
);

export default HomePage;
