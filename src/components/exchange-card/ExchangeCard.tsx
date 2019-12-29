import React, { useState, useEffect, FC } from "react";
import classNames from 'classnames';
import ExchangeCardCurrency from "./ExchangeCardCurrency";
import { connect } from "react-redux";
import { TOGGLE_EXCHANGE_METHOD } from "../../constants";
import CalcCurrency from "../../utils/calcCurrency";
import { Skeleton } from "antd";
import { ReactComponent as IconExchange } from "../../assets/images/exchange-arrows.svg";
import Big from "big.js";
import classnames from "classnames";
import { Exchange, SN } from "../../types";
import { ExchangesState } from "../../store/types";
import getIcon from "../../utils/getIcon";
import { toFix, setNumber } from "../../utils/formatCurrency";
import { methodsTranslate } from "../../utils/helpers";
import { ReactComponent as IconMono } from '../../assets/images/mono.svg';

const { calcDiv, calcMul } = new CalcCurrency();

interface IBaseProps {
  className?: string;
}

interface IStateProps {
  exchange: Exchange;
  method: string;
  loading: boolean;
}

interface IDispatchProps {
  toggleExchangeMethod: () => string;
}

type IProps = IBaseProps & IStateProps & IDispatchProps;

const ExchangeCard: FC<IProps> = (props: IProps) => {
  const {
    className = "",
    exchange,
    method,
    loading,
    toggleExchangeMethod
  } = props;

  const {
    currencyA: { code: codeA, currency: currencyA, country: countryA = "" },
    currencyB: { code: codeB, currency: currencyB, country: countryB = "" },
    NB,
    precision = 4
  } = exchange as Exchange;

  const [valueA, setValueA] = useState(1 as SN);
  const [valueB, setValueB] = useState("" as SN);
  const [valueNBU, setValueNBU] = useState(1 as SN);
  const [valueNBU2, setValueNBU2] = useState("" as SN);

  const rates: any = {
    sell: exchange.rateBuy,
    buy: exchange.rateSell,
    cross: exchange.rateCross
  };

  const rateA: SN = rates[method] || 1;
  const rateB: SN | Big = new Big(1).div(rateA).toString();
  const hasExchange = codeA && codeB;

  useEffect(() => {
    if (![!!valueA, !!rateA, !!precision].includes(false)) {
      setNumber((valueA: any) => {
        setValueA(valueA);
        setValueB(calcMul(valueA, rateA));
        if (NB) {
          setValueNBU(valueA);
          setValueNBU2(calcMul(valueA, NB.rate))
        };
      })(valueA, precision);
    }
    // eslint-disable-next-line
  }, [method, NB, currencyA, currencyB]);

  const handleChangeA = (e: any): void => {
    const { value } = e.target;
    setNumber((v: any) => {
      setValueA(v);
      setValueB(calcMul(v, rateA));
      if (NB) {
        setValueNBU(v);
        setValueNBU2(calcMul(v, NB.rate));
      };
    })(value, precision);
  };

  const handleChangeB = (e: any): void => {
    const { value } = e.target;
    setNumber((v: any) => {
      setValueB(v);
      setValueA(calcDiv(v, rateA));
      if (NB) {
        setValueNBU2(v);
        setValueNBU(calcDiv(v, NB.rate));
      };
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
        	    "exchange-card__icon-exchange exchange-card__icon-exchange--for-skeleton"
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
          value={toFix(valueA, precision)}
          valueB={toFix(valueB, precision)}
          valueNBU={toFix(valueNBU, precision)}
          valueNBU2={toFix(valueNBU2, precision)}
          setValue={handleChangeA}
          icon={getIcon(countryA, codeA)}
          rate={toFix(rateA, precision)}
          codeA={codeB}
          codeB={codeA}
          NB={NB}
          currencyB={currencyA}
        />
        <div className={classNames("exchange-card__toggle-wrapper")}>
          <button
            onClick={toggleExchangeMethod}
            className={`exchange-card__toggle`}
            disabled={method === "cross"}
            title={method}
          >
            <IconExchange
              className={classnames("exchange-card__icon-exchange", method)}
            />
          </button>
          <span
            className={`exchange-card__method  exchange-card__method--mobile ${method}`}
          >
            {methodsTranslate[method]}
          </span>
        </div>
        <IconMono className={classNames('exchange-card__icon-mono is-desktop', { 'single': !NB })}/>
        {NB && (<div className='exchange-card__icon-nbu is-desktop'>
          <img src={require('../../assets/images/nb.png')} alt=""/>
          <span>НБУ</span>
        </div>)}
        <span className={`exchange-card__method ${method}`}>{methodsTranslate[method]}</span>
        <ExchangeCardCurrency
          value={toFix(valueB, precision)}
          valueB={toFix(valueA, precision)}
          valueNBU={toFix(valueNBU2, precision)}
          valueNBU2={toFix(valueNBU, precision)}
          setValue={handleChangeB}
          icon={getIcon(countryB, codeB)}
          rate={toFix(rateB, precision)}
          codeA={codeA}
          codeB={codeB}
          NB={NB}
          currencyB={currencyB}
        />
      </div>
      <button onClick={toggleExchangeMethod} className={classNames("exchange-card__description-wrapper", method)}>
        {method !== "cross" ? (
          <p className="exchange-card__description">
            Я зможу { method === "buy" ? 'придбати' : 'продати'}{" "}
            <span>
              {toFix(valueA, 2)} {codeA}
            </span>{" "}
            <span>
              {(NB && valueNBU !== valueA) && `(${toFix(valueNBU, 2)} ${codeA} за курсом НБУ)`}
            </span>{" "}
            за{" "}
            <span>
              {toFix(valueB, 2)} {codeB}
            </span>{" "}
            <span>
              {(NB && valueNBU2 !== valueB) && `(${toFix(valueNBU2, 2)} ${codeB} за курсом НБУ)`}
            </span>
          </p>
        ) : (
          <p className="exchange-card__description">
            <span>
              {toFix(valueA, 2)} {codeA}
            </span>{" "}
            <span>
              {(NB && valueNBU !== valueA) && `(${toFix(valueNBU, 2)} ${codeA} за курсом НБУ)`}
            </span>{" "}
            коштує{" "}
            <span>
              {toFix(valueB, 2)} {codeB}
            </span>{" "}
            <span>
              {(NB && valueNBU2 !== valueB) && `(${toFix(valueNBU2, 2)} ${codeB} за курсом НБУ)`}
            </span>
          </p>
        )}
      </button>
    </div>
  );
};

export default connect<IStateProps, IDispatchProps, IBaseProps, ExchangesState>(
  ({ exchange, loading, method }: ExchangesState) => ({
    exchange,
    loading,
    method
  }),
  {
    toggleExchangeMethod: () => TOGGLE_EXCHANGE_METHOD
  }
)(ExchangeCard);
