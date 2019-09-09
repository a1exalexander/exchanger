import React, { useState, useEffect } from 'react';
import ExchangeCardCurrency from './ExchangeCardCurrency';
import { connect } from 'react-redux';
import { TOGGLE_EXCHANGE_METHOD } from '../../constants';
import CalcCurrency from '../../utils/calcCurrency';
import { Skeleton } from 'antd';
import { Decimal } from 'decimal.js';

const { calcByA, calcByB } = new CalcCurrency();

const ExchangeCard = props => {

  const {
    className = '',
    exchange,
    method,
    loading,
    toggleExchangeMethod
  } = props;

  const {
    currencyA: { code: codeA, currency: currencyA, country: countryA },
    currencyB: { code: codeB, currency: currencyB, country: countryB }
  } = exchange;

  const [valueA, setValueA] = useState('');
  const [valueB, setValueB] = useState('');

  const rates = {
    buy: exchange.rateBuy,
    sell: exchange.rateSell,
    cross: exchange.rateCross
  };

  useEffect(() => {
    if (valueA && valueB) {
      calcByB(valueB, rates[props.method], setValueB, setValueA);
    }
  }, [method, exchange.currencyCodeA, exchange.currencyCodeB])

  const getIcon = country => require(`../../assets/flags/${country}.svg`);

  const handleChangeA = (e) => {
    calcByA(e.target.value, rates[method], setValueA, setValueB);
  }

  const handleChangeB = (e) => {
    calcByB(e.target.value, rates[method], setValueB, setValueA);
  }

  const rateB = Decimal.div(1, rates[method]).toFixed(4);

  if (loading) {
    return (
      <div className={`exchange-card ${className}`}>
        <Skeleton className='exchange-card__skeleton' active paragraph={{rows: 3}} title={false}/>
        <i className="fas fa-exchange-alt exchange-card__icon-exchange"></i>
        <Skeleton className='exchange-card__skeleton' active paragraph={{rows: 3}} title={false}/>
      </div>
    )
  }

  return (
    <div className={`exchange-card fadeIn ${className}`}>
      <ExchangeCardCurrency
        value={valueB}
        setValue={handleChangeB}
        icon={getIcon(countryB)}
        rate={rateB}
        codeA={codeA}
        codeB={codeB}
        currencyB={currencyB}
      />
      <button
        onClick={toggleExchangeMethod}
        className={`exchange-card__toggle ${method}`}
        title={method}
      >
        <i className="fas fa-exchange-alt exchange-card__icon-exchange"></i>
      </button>
      <ExchangeCardCurrency
        value={valueA}
        setValue={handleChangeA}
        icon={getIcon(countryA)}
        rate={rates[method]}
        codeA={codeB}
        codeB={codeA}
        currencyB={currencyA}
      />
    </div>
  );
};

const mapStateToProps = ({ exchange, currencies, loading, method }) => {
  return { exchange, currencies, loading, method };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleExchangeMethod: () => dispatch(TOGGLE_EXCHANGE_METHOD)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeCard);
