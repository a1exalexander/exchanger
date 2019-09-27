import React, { useState, useEffect, FC } from 'react';
import ExchangeCardCurrency from './ExchangeCardCurrency';
import { connect } from 'react-redux';
import { TOGGLE_EXCHANGE_METHOD } from '../../constants';
import CalcCurrency from '../../utils/calcCurrency';
import { Skeleton } from 'antd';
import Big from 'big.js';
import { Exchange, SN, Currency } from '../../types';
import { ExchangesState } from '../../store/types';
import getIcon from '../../utils/getIcon';
import { toFix, setNumber } from '../../utils/formatCurrency';
import { updateComputedPrice, updateComputedCurrency } from '../../store/actions';

const { calcByA, calcByB, calcDiv, calcMul } = new CalcCurrency();

interface IBaseProps {
  className?: string;
}

interface IStateProps {
  exchange: Exchange;
  method: string,
  loading: boolean;
  computedCurrency: Currency;
}

interface IDispatchProps {
  toggleExchangeMethod: () => string;
  updateComputedPrice: (v: any) => any;
  updateComputedCurrency: (v: any) => any;
}

type IProps = IBaseProps & IStateProps & IDispatchProps;

const ExchangeCard: FC<IProps> = (props: IProps) => {

  const  {
    className = '',
    exchange,
    method,
    loading,
    toggleExchangeMethod,
    updateComputedPrice,
    updateComputedCurrency,
    computedCurrency,
  } = props;

  const {
    currencyA: { code: codeA, currency: currencyA, country: countryA = '' },
    currencyB: { code: codeB, currency: currencyB, country: countryB = '' },
    precision = 4,
  } = exchange as Exchange;

  const [valueA, setValueA] = useState(1 as SN);
  const [valueB, setValueB] = useState('' as SN);

  const rates: any = {
    buy: exchange.rateBuy,
    sell: exchange.rateSell,
    cross: exchange.rateCross
  };

  const rateA: SN = rates[method] || 1;

  useEffect(() => {
    if (valueA) {
      setNumber((valueA: any) => {
        setValueA(valueA);
        setValueB(calcMul(valueA, rateA));
      })(valueA, precision);
    }
  }, [method, exchange.currencyCodeA, exchange.currencyCodeB])

  const handleChangeA = (e: any): void => {
    const { value } = e.target;
    setNumber((v: any) => {
      setValueA(v);
      setValueB(calcMul(v, rateA));
      updateComputedPrice(calcMul(v, rateA))
    })(value, precision);
  }

  const handleChangeB = (e: any): void => {
    const { value } = e.target;
    setNumber((v: any) => {
      setValueB(v);
      setValueA(calcDiv(v, rateA));
      updateComputedPrice(calcDiv(v, rateA))
    })(value, precision);
  }

  const startInputA = () => {
    updateComputedCurrency(exchange.currencyB)
    updateComputedPrice(valueB)
  }

  const startInputB = () => {
    updateComputedCurrency(exchange.currencyA)
    updateComputedPrice(valueA)
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
        startInput={startInputA}
        endInput={() => updateComputedPrice(null)}
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
        startInput={startInputB}
        endInput={() => updateComputedPrice(null)}
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
  ({exchange, loading, method, computedCurrency}: ExchangesState) => ({ exchange, loading, method, computedCurrency }),
  {
    toggleExchangeMethod: () => TOGGLE_EXCHANGE_METHOD,
    updateComputedPrice,
    updateComputedCurrency,
  }
)(ExchangeCard);
