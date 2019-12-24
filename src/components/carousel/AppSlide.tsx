import React from 'react';
import { Exchange } from '../../types';
import { connect } from 'react-redux';
import getIcon from '../../utils/getIcon';
import { setExchange } from '../../store/actions';
import { ReactComponent as IconExchange } from '../../assets/images/exchange-arrows.svg';
import ReactGA from 'react-ga';
import { toFix } from '../../utils/formatCurrency';

const AppSlide = ({ exchange, setExchange }: { exchange: Exchange, setExchange: any }) => {

  const {
    id,
    rateBuy = '',
    rateSell = '',
    rateCross = '',
    currencyA: { code: codeA, currency: currencyA, country: countryA = '' },
    currencyB: { code: codeB, currency: currencyB, country: countryB = '' }
  } = exchange;

  const handleClick = (e: any) => {
    ReactGA.event({
      category: 'Currencies',
      action: 'Tap to slide card',
    });
    e.preventDefault();
    setExchange(id);
  };

  const priceElement = () => {
    if (rateBuy) {
      return (
        <div className="app-slide__row">
          <div>
            <span className="app-slide__label app-slide__label--sell">Sell: </span>
            <span className="app-slide__value">{toFix(rateBuy, 4)}</span>
          </div>
          <IconExchange className={'app-slide__icon-exchange'}/>
          <div>
            <span className="app-slide__label app-slide__label--buy">
              Buy:{' '}
            </span>
            <span className="app-slide__value">{toFix(rateSell, 4)}</span>
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
    <li
      onClick={handleClick}
      className="app-slide">
      <div className="app-slide__row">
        <img className="app-slide__icon" alt='' uk-img={`data-src: ${getIcon(countryB, codeB)}`} uk-svg/>
        <span className="app-slide__currency">{codeB}</span>
        <span className="app-slide__currency-name">{currencyB}</span>
      </div>
      {priceElement()}
      <div className="app-slide__row">
        <img className="app-slide__icon" alt='' uk-img={`data-src: ${getIcon(countryA, codeA)}`} uk-svg/>
        <span className="app-slide__currency">{codeA}</span>
        <span className="app-slide__currency-name">{currencyA}</span>
      </div>
    </li>
  );
};

export default connect(
  null,
  { setExchange }
)(AppSlide);
