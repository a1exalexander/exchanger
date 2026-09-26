import React, { FC } from 'react';
import { Exchange, SN } from '../../types';
import { connect } from 'react-redux';
import getIcon from '../../utils/getIcon';
import { setExchange } from '../../store/actions';
import IconExchange from '../../assets/images/exchange-arrows.svg?react';
import { toFix } from '../../utils/formatCurrency';
import { getCurrencyName } from '../../utils/currencyMeta';
import { useLang, useT } from '../../i18n';

interface Props {
  exchange: Exchange;
  setExchange: (payload: SN) => void;
}

const AppSlide: FC<Props> = ({ exchange, setExchange }) => {
  const {
    id,
    rateBuy = '',
    rateSell = '',
    rateCross = '',
    currencyA: { code: codeA, country: countryA = '' },
    currencyB: { code: codeB, country: countryB = '' },
  } = exchange;
  const lang = useLang();
  const t = useT();

  const handleClick = (e: any) => {
    e.preventDefault();
    setExchange(id);
    if (!window.matchMedia?.('(min-width: 860px)').matches) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const priceElement = () => {
    if (rateBuy) {
      return (
        <div className="app-slide__row">
          <div className="app-slide__inner">
            <span className="app-slide__label app-slide__label--sell">
              {t.slide.sell}{' '}
            </span>
            <span className="app-slide__value">{toFix(rateBuy, 2)}</span>
          </div>
          <IconExchange className={'app-slide__icon-exchange'} />
          <div className="app-slide__inner">
            <span className="app-slide__label app-slide__label--buy">
              {t.slide.buy}{' '}
            </span>
            <span className="app-slide__value">{toFix(rateSell, 2)}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="app-slide__inner">
        <span className="app-slide__label app-slide__label--cross">
          {t.slide.cross}{' '}
        </span>
        <span className="app-slide__value">{rateCross}</span>
      </div>
    );
  };

  return (
    <li
      onClick={handleClick}
      className="app-slide"
      title={t.slide.open(codeA, codeB)}
    >
      <div className="app-slide__row">
        <img
          className="app-slide__icon"
          alt={countryB}
          src={getIcon(countryB, codeB)}
        />
        <span className="app-slide__currency">{codeB}</span>
        <span className="app-slide__currency-name">
          {getCurrencyName(codeB, null, lang)}
        </span>
      </div>
      {priceElement()}
      <div className="app-slide__row">
        <img
          className="app-slide__icon"
          alt={countryA}
          src={getIcon(countryA, codeA)}
        />
        <h3 className="app-slide__currency">{codeA}</h3>
        <h4 className="app-slide__currency-name">
          {getCurrencyName(codeA, null, lang)}
        </h4>
      </div>
    </li>
  );
};

export default connect(null, { setExchange })(AppSlide);
