import React, { useState, useEffect, FC, useMemo } from 'react';
import classNames from 'classnames';
import ExchangeCardCurrency from './ExchangeCardCurrency';
import { connect } from 'react-redux';
import { SET_RATE_VALUE, TOGGLE_EXCHANGE_METHOD } from '../../constants';
import CalcCurrency from '../../utils/calcCurrency';
import { Skeleton } from 'antd';
import { ReactComponent as IconExchange } from '../../assets/images/exchange-arrows.svg';
import Big from 'big.js';
import classnames from 'classnames';
import { Currencies, Exchange, SN } from '../../types';
import { ExchangesState } from '../../store/types';
import getIcon from '../../utils/getIcon';
import { toFix, setNumber } from '../../utils/formatCurrency';
import { methodsTranslate } from '../../utils/helpers';
import { useDebounce } from 'usehooks-ts';

const { calcDiv, calcMul } = new CalcCurrency();

interface IBaseProps {
  className?: string;
}

interface IStateProps {
  exchange: Exchange;
  method: ExchangesState['method'];
  loading: boolean;
  currencies: Currencies;
}

interface IDispatchProps {
  toggleExchangeMethod: () => string;
}

type IProps = IBaseProps & IStateProps & IDispatchProps;

const ExchangeCard: FC<IProps> = (props: IProps) => {
  const {
    className = '',
    exchange,
    method,
    loading,
    toggleExchangeMethod,
    currencies,
  } = props;

  const {
    currencyA: { code: codeA, currency: currencyA, country: countryA = '' },
    currencyB: { code: codeB, currency: currencyB, country: countryB = '' },
    NB,
    id,
    precision = 4,
  } = exchange as Exchange;

  const [valueA, setValueA] = useState(1 as SN);
  const [valueB, setValueB] = useState('' as SN);

  const debouncedValueA = useDebounce(valueA, 1000);
  const debouncedValueB = useDebounce(valueB, 1000);

  useEffect(() => {
    if (debouncedValueA) {
      window?.posthog?.capture(SET_RATE_VALUE, {
        [`${SET_RATE_VALUE}/value`]: Number(debouncedValueA),
        [`${SET_RATE_VALUE}/method`]: method,
        [`${SET_RATE_VALUE}/code`]: currencyA,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValueA]);

  useEffect(() => {
    if (debouncedValueB) {
      window?.posthog?.capture(SET_RATE_VALUE, {
        [`${SET_RATE_VALUE}/value`]: Number(debouncedValueB),
        [`${SET_RATE_VALUE}/method`]: method,
        [`${SET_RATE_VALUE}/code`]: currencyB,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValueB]);

  const { rateBuy, rateCross, rateSell, grow } = useMemo(() => {
    const matchedExchange = currencies.find((el) => el.id === id);
    return (
      matchedExchange || ({ rateBuy: 0, rateCross: 0, rateSell: 0 } as Exchange)
    );
  }, [currencies, id]);

  const rates = {
    sell: rateBuy,
    buy: rateSell,
    cross: NB?.rate || rateCross,
  };

  const rateA: SN = rates[method] || rates.cross || 1;
  const rateB: SN | Big = new Big(1).div(rateA).toString();
  const hasExchange = codeA && codeB;

  useEffect(() => {
    if (![!!valueA, !!rateA, !!precision].includes(false)) {
      setNumber((valueA: any) => {
        setValueA(valueA);
        setValueB(calcMul(valueA, rateA));
      })(valueA, precision);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, currencyA, currencyB]);

  const handleChangeA = (e: any): void => {
    const { value } = e.target;
    setNumber((v: any) => {
      setValueA(v);
      setValueB(calcMul(v, rateA));
    })(value, precision);
  };

  const handleChangeB = (e: any): void => {
    const { value } = e.target;
    setNumber((v: any) => {
      setValueB(v);
      setValueA(calcDiv(v, rateA));
    })(value, precision);
  };

  if (loading && !hasExchange) {
    return (
      <div className={`exchange-card ${className}`}>
        <div className="exchange-card__main">
          <Skeleton
            className="exchange-card__skeleton"
            active
            paragraph={{ rows: 3 }}
            title={false}
          />
          <IconExchange
            className={classnames(
              'exchange-card__icon-exchange exchange-card__icon-exchange--for-skeleton',
            )}
          />
          <Skeleton
            className="exchange-card__skeleton"
            active
            paragraph={{ rows: 3 }}
            title={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`exchange-card fadeIn ${className}`}>
      <div className="exchange-card__main">
        <ExchangeCardCurrency
          value={toFix(valueA, 2)}
          valueB={toFix(valueB, 2)}
          setValue={handleChangeA}
          icon={getIcon(countryA, codeA)}
          rate={toFix(rateA, precision)}
          codeA={codeB}
          codeB={codeA}
          currencyB={NB ? NB.txt : currencyA}
          grow={grow}
          growTop={true}
        />
        <div className="exchange-card__toggle-wrapper">
          <button
            onClick={toggleExchangeMethod}
            className={`exchange-card__toggle`}
            disabled={method === 'cross'}
            title={method}
          >
            <IconExchange
              className={classnames('exchange-card__icon-exchange', method)}
            />
          </button>
          <span
            className={`exchange-card__method  exchange-card__method--mobile ${method}`}
          >
            {methodsTranslate[method]}
          </span>
        </div>
        <span className={`exchange-card__method ${method}`}>
          {methodsTranslate[method]}
        </span>
        <ExchangeCardCurrency
          value={toFix(valueB, 2)}
          valueB={toFix(valueA, 2)}
          setValue={handleChangeB}
          icon={getIcon(countryB, codeB)}
          rate={toFix(rateB, precision)}
          codeA={codeA}
          codeB={codeB}
          currencyB={currencyB === 'Hryvnia' ? 'Українська гривня' : currencyB}
          grow={grow}
          growTop={false}
        />
      </div>
      <button
        onClick={toggleExchangeMethod}
        className={classNames('exchange-card__description-wrapper', method)}
      >
        {method !== 'cross' ? (
          <p className="exchange-card__description">
            Я зможу {method === 'buy' ? 'придбати' : 'продати'}{' '}
            <span>
              {toFix(valueA, 2)} {codeA}
            </span>{' '}
            за{' '}
            <span>
              {toFix(valueB, 2)} {codeB}
            </span>
          </p>
        ) : (
          <p className="exchange-card__description">
            <span>
              {toFix(valueA, 2)} {codeA}
            </span>{' '}
            коштує{' '}
            <span>
              {toFix(valueB, 2)} {codeB}
            </span>
          </p>
        )}
      </button>
    </div>
  );
};

export default connect<IStateProps, IDispatchProps, IBaseProps, ExchangesState>(
  ({ exchange, loading, method, currencies }: ExchangesState) => ({
    exchange,
    loading,
    method,
    currencies,
  }),
  {
    toggleExchangeMethod: () => TOGGLE_EXCHANGE_METHOD,
  },
)(ExchangeCard);
