import React, { useState, useEffect } from 'react';
import ExchangeCardCurrency from './ExchangeCardCurrency';
import { connect } from 'react-redux';
import { TOGGLE_EXCHANGE_METHOD } from '../../constants';
import CalcCurrency from '../../utils/calcCurrency';
import { Skeleton } from 'antd';
import { Decimal } from 'decimal.js';
import { Exchange, SN } from '../../types';
import { ExchangesState } from '../../store/types';

const { calcByA, calcByB } = new CalcCurrency();

interface ExchangeCardProps {
  className: string;
  exchange: Exchange;
  method: string,
  loading: boolean;
  toggleExchangeMethod: () => string;
}

const ExchangeCard = (props: ExchangeCardProps) => {

  const  {
    className = '',
    exchange,
    method,
    loading,
    toggleExchangeMethod
  } = props;

  const {
    currencyA: { code: codeA, currency: currencyA, country: countryA },
    currencyB: { code: codeB, currency: currencyB, country: countryB }
  } = exchange as Exchange;

  const [valueA, setValueA] = useState('');
  const [valueB, setValueB] = useState('');

  const rates: any = {
    buy: exchange.rateBuy,
    sell: exchange.rateSell,
    cross: exchange.rateCross
  };

  useEffect(() => {
    if (valueA && valueB) {
      calcByB(valueB, rates[method], setValueB, setValueA);
    }
  }, [method, exchange.currencyCodeA, exchange.currencyCodeB])

  const getIcon = (country: string) => country ? require(`../../assets/flags/${country}.svg`) : '';

  const rateA: SN = rates[method] || 1;

  const handleChangeA = (e: any): void => {
    calcByA(e.target.value, rateA, setValueA, setValueB);
  }

  const handleChangeB = (e: any): void => {
    calcByB(e.target.value, rateA, setValueB, setValueA);
  }

  const rateB: SN = loading ? '' : Decimal.div(1, rateA).toFixed(4);

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
      <span className={`exchange-card__method ${method}`}>{method}</span>
      <ExchangeCardCurrency
        value={valueA}
        setValue={handleChangeA}
        icon={getIcon(countryA)}
        rate={rateA}
        codeA={codeB}
        codeB={codeA}
        currencyB={currencyA}
      />
    </div>
  );
};

const mapStateToProps = ({ exchange, currencies, loading, method }: ExchangesState) => {
  return { exchange, currencies, loading, method };
};

const mapDispatchToProps = (dispatch: any): any => {
  return {
    toggleExchangeMethod: () => dispatch(TOGGLE_EXCHANGE_METHOD) as string
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeCard);
