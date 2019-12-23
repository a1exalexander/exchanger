import React, { useState, useEffect, FC } from 'react';
import ExchangeCardCurrency from './ExchangeCardCurrency';
import { connect } from 'react-redux';
import { TOGGLE_EXCHANGE_METHOD } from '../../constants';
import CalcCurrency from '../../utils/calcCurrency';
import { Skeleton } from 'antd';
import { ReactComponent as IconExchange } from '../../assets/images/exchange-arrows.svg';
import Big from 'big.js';
import classnames from 'classnames';
import { Exchange, SN } from '../../types';
import { ExchangesState } from '../../store/types';
import getIcon from '../../utils/getIcon';
import { toFix, setNumber } from '../../utils/formatCurrency';

const { calcDiv, calcMul } = new CalcCurrency();

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
    toggleExchangeMethod,
  } = props;

  const {
    currencyA: { code: codeA, currency: currencyA, country: countryA = '' },
    currencyB: { code: codeB, currency: currencyB, country: countryB = '' },
    precision = 4,
  } = exchange as Exchange;

  const [valueA, setValueA] = useState(1 as SN);
  const [valueB, setValueB] = useState('' as SN);

  const rates: any = {
    sell: exchange.rateBuy,
    buy: exchange.rateSell,
    cross: exchange.rateCross
  };

  const rateA: SN = rates[method] || 1;

  useEffect(() => {
    if (![!!valueA, !!rateA, !!precision].includes(false)) {
      setNumber((valueA: any) => {
        setValueA(valueA);
        setValueB(calcMul(valueA, rateA));
      })(valueA, precision);
    }
    // eslint-disable-next-line
  }, [method, currencyA, currencyB])

  const handleChangeA = (e: any): void => {
    const { value } = e.target;
    setNumber((v: any) => {
      setValueA(v);
      setValueB(calcMul(v, rateA));
    })(value, precision);
  }

  const handleChangeB = (e: any): void => {
    const { value } = e.target;
    setNumber((v: any) => {
      setValueB(v);
      setValueA(calcDiv(v, rateA));
    })(value, precision);
  }

  const rateB: SN | Big = loading ? '' : new Big(1).div(rateA).toString();

  if (loading) {
    return (
      <div className={`exchange-card ${className}`}>
        <Skeleton className='exchange-card__skeleton' active paragraph={{rows: 3}} title={false}/>
        <IconExchange className={classnames('exchange-card__icon-exchange exchange-card__icon-exchange--for-skeleton')}/>
        <Skeleton className='exchange-card__skeleton' active paragraph={{rows: 3}} title={false}/>
      </div>
    )
  }

  return (
    <div className={`exchange-card fadeIn ${className}`}>
      <ExchangeCardCurrency
        value={toFix(valueA, precision)}
        valueB={toFix(valueB, precision)}
        setValue={handleChangeA}
        icon={getIcon(countryA, codeA)}
        rate={toFix(rateA, precision)}
        codeA={codeB}
        codeB={codeA}
        currencyB={currencyA}
      />
      <div className='exchange-card__toggle-wrapper'>
        <button
          onClick={toggleExchangeMethod}
          className={`exchange-card__toggle`}
          title={method}
        >
          <IconExchange className={classnames('exchange-card__icon-exchange', method)}/>
        </button>
        <span className={`exchange-card__method  exchange-card__method--mobile ${method}`}>{method}</span>
      </div>
      <span className={`exchange-card__method ${method}`}>{method}</span>
      <ExchangeCardCurrency
        value={toFix(valueB, precision)}
        valueB={toFix(valueA, precision)}
        setValue={handleChangeB}
        icon={getIcon(countryB, codeB)}
        rate={toFix(rateB, precision)}
        codeA={codeA}
        codeB={codeB}
        currencyB={currencyB}
      />
    </div>
  );
};

export default connect<IStateProps, IDispatchProps, IBaseProps, ExchangesState>(
  ({exchange, loading, method }: ExchangesState) => ({ exchange, loading, method }),
  {
    toggleExchangeMethod: () => TOGGLE_EXCHANGE_METHOD,
  }
)(ExchangeCard);
