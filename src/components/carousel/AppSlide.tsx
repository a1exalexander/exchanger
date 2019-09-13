import React from 'react';
import { Exchange } from '../../types';

const AppSlide = ({ exchange }: { exchange: Exchange }) => {

  const {
    rateBuy = '',
    rateSell = '',
    rateCross = '',
    currencyA: { code: codeA, currency: currencyA, country: countryA },
    currencyB: { code: codeB, currency: currencyB, country: countryB }
  } = exchange;

  const getIcon = (country: string) => require(`../../assets/flags/${country}.svg`);

  const priceElement = () => {
    if (rateBuy) {
      return (
        <div className="app-slide__row">
          <div>
            <span className="app-slide__label app-slide__label--sell">Sell: </span>
            <span className="app-slide__value">{rateSell}</span>
          </div>
          <i className="fas fa-exchange-alt app-slide__icon-exchange"></i>
          <div>
            <span className="app-slide__label app-slide__label--buy">
              Buy:{' '}
            </span>
            <span className="app-slide__value">{rateBuy}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="app-slide__row">
        <span className="app-slide__label app-slide__label--cross">
          Rate cross:{' '}
        </span>
        <span className="app-slide__value">{rateCross}</span>
      </div>
    );
  };

  return (
    <li className="app-slide">
      <div className="app-slide__row">
        <object type="image/svg+xml" data={getIcon(countryB)} className="app-slide__icon"> </object>
        <span className="app-slide__currency">{codeB}</span>
        <span className="app-slide__currency-name">{currencyB}</span>
      </div>
      {priceElement()}
      <div className="app-slide__row">
        <object type="image/svg+xml" data={getIcon(countryA)} className="app-slide__icon"> </object>
        <span className="app-slide__currency">{codeA}</span>
        <span className="app-slide__currency-name">{currencyA}</span>
      </div>
    </li>
  );
};

export default AppSlide;
