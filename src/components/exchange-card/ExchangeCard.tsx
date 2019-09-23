import React, { useState, useEffect, FC } from 'react';
import ExchangeCardCurrency from './ExchangeCardCurrency';
import { connect } from 'react-redux';
import { TOGGLE_EXCHANGE_METHOD } from '../../constants';
import CalcCurrency from '../../utils/calcCurrency';
import { Skeleton } from 'antd';
import Big from 'big.js';
import { Exchange, SN } from '../../types';
import { ExchangesState } from '../../store/types';
import getIcon from '../../utils/getIcon';
import { toFix } from '../../utils/formatCurrency';

const { calcByA, calcByB } = new CalcCurrency();

interface IBaseProps {
  className?: string;
}

interface IStateProps {
  exchange: Exchange;
  method: string,
  loading: boolean;
  
}

interface IDispatchProps {
  toggleExchangeMethod: () => string;
}

type IProps = IBaseProps & IStateProps & IDispatchProps;

const ExchangeCard: FC<IProps> = (props: IProps) => {

  const  {
    className = '',
    exchange,
    method,
    loading,
    toggleExchangeMethod
  } = props;

  const {
    currencyA: { code: codeA, currency: currencyA, country: countryA = '' },
    currencyB: { code: codeB, currency: currencyB, country: countryB = '' },
    precision,
  } = exchange as Exchange;

  const [valueA, setValueA] = useState(1);
  const [valueB, setValueB] = useState('');

  const rates: any = {
    buy: exchange.rateBuy,
    sell: exchange.rateSell,
    cross: exchange.rateCross
  };

  useEffect(() => {
    if (valueA) {
      calcByA(valueA, rates[method], setValueA, setValueB);
    }
  }, [method, exchange.currencyCodeA, exchange.currencyCodeB])

  const rateA: SN = rates[method] || 1;

  const handleChangeA = (e: any): void => {
    calcByA(e.target.value, rateA, setValueA, setValueB);
  }

  const handleChangeB = (e: any): void => {
    calcByB(e.target.value, rateA, setValueB, setValueA);
  }

  const rateB: SN | Big = loading ? '' : new Big(1).div(rateA).round(precision).toString();

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
        value={toFix(valueA, precision)}
        setValue={handleChangeA}
        icon={getIcon(countryA, codeA)}
        rate={rateA}
        codeA={codeB}
        codeB={codeA}
        currencyB={currencyA}
      />
      <div className='exchange-card__toggle-wrapper'>
        <button
          onClick={toggleExchangeMethod}
          className={`exchange-card__toggle ${method}`}
          title={method}
        >
          <i className="fas fa-exchange-alt exchange-card__icon-exchange"></i>
        </button>
        <span className={`exchange-card__method  exchange-card__method--mobile ${method}`}>{method}</span>
      </div>
      <span className={`exchange-card__method ${method}`}>{method}</span>
      <ExchangeCardCurrency
        value={toFix(valueB, precision)}
        setValue={handleChangeB}
        icon={getIcon(countryB, codeB)}
        rate={rateB}
        codeA={codeA}
        codeB={codeB}
        currencyB={currencyB}
      />
    </div>
  );
};

export default connect<IStateProps, IDispatchProps, IBaseProps, ExchangesState>(
  ({exchange, loading, method}: ExchangesState) => ({ exchange, loading, method }),
  (dispatch: any) => ({toggleExchangeMethod: () => dispatch(TOGGLE_EXCHANGE_METHOD)})
)(ExchangeCard);
