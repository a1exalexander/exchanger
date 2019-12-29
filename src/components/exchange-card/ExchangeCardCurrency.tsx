import React, { FC, useState, useEffect, Fragment } from "react";
import { inputFontSize } from "../../utils/helpers";
import classNames from 'classnames';
import { SN, NBRate } from "../../types";
import { ReactComponent as IconMono } from '../../assets/images/mono.svg';
import Big from "big.js";

interface IHelperProps {
  codeA: string;
  valueB: SN;
  valueNBU: SN;
  NB?: null | NBRate;
}

const HelperCount: FC<IHelperProps> = props => {
  const { codeA, valueB, NB, valueNBU } = props;

  const [rerender, setRerender] = useState(true);
  
  useEffect(() => {
    const forceUpdate = async () => {
      if (rerender) setRerender(false);
      setTimeout(() => setRerender(true));
      return;
    };
    forceUpdate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueB]);

  return rerender ? (
    <span className="exchange-card-currency__computed fadeIn">
      {valueB} {codeA} {(NB && valueNBU !== valueB) && `(${valueNBU} по НБУ)`}
    </span>
  ) : null;
};

interface IBaseProps {
  icon: string;
  codeA: string;
  codeB: string;
  currencyB: string;
  rate: SN | Big;
  value: SN;
  valueB: SN;
  NB?: null | NBRate;
  setValue: any;
  valueNBU: SN;
  valueNBU2: SN;
}

const ExchangeCardCurrency: FC<IBaseProps> = props => {
  const {
    icon,
    codeA,
    codeB,
    currencyB,
    NB,
    rate,
    value,
    valueB,
    setValue,
    valueNBU,
    valueNBU2,
  } = props;

  const [inputStatus, setInputStatus] = useState(false);

  return (
    <div className="exchange-card-currency">
      <div className="exchange-card-currency__head">
        <span className="exchange-card-currency__currency">{codeB}</span>
        <div className="exchange-card-currency__row">
          <span className="exchange-card-currency__info">{codeB === 'UAH' ? 'Українська гривня' : NB ? NB.txt : currencyB}</span>
          <img className="exchange-card-currency__icon" src={icon} alt="" />
        </div>
        <div className="exchange-card-currency__rate">
          = {rate} {codeA}
        </div>
      </div>
      <input
        onBlur={() => setInputStatus(false)}
        onFocus={() => setInputStatus(true)}
        style={{ fontSize: inputFontSize(value) }}
        type="text"
        className="exchange-card-currency__input"
        value={value}
        onChange={setValue}
        placeholder={`Enter "${currencyB}" amount`}
      />
      <div className='exchange-card-currency__input-wrapper is-mobile'>
        <input
          onBlur={() => setInputStatus(false)}
          onFocus={() => setInputStatus(true)}
          style={{ fontSize: inputFontSize(value) }}
          type="number"
          className="exchange-card-currency__input exchange-card-currency__input--mobile"
          value={value}
          onChange={setValue}
          placeholder={`Enter "${currencyB}" amount`}
        />
        <IconMono className={classNames('exchange-card-currency__icon-mono is-mobile', { 'single': !NB })}/>
      </div>
      {NB && (<Fragment>
        <input
          onBlur={() => setInputStatus(false)}
          onFocus={() => setInputStatus(true)}
          style={{ fontSize: inputFontSize(value) }}
          type="text"
          className="exchange-card-currency__input"
          value={valueNBU}
          onChange={setValue}
          placeholder={`Enter "${currencyB}" amount`}
        />
        <div className="exchange-card-currency__input-wrapper is-mobile">
          <input
            onBlur={() => setInputStatus(false)}
            onFocus={() => setInputStatus(true)}
            style={{ fontSize: inputFontSize(value) }}
            type="number"
            className="exchange-card-currency__input exchange-card-currency__input--mobile"
            value={valueNBU}
            onChange={setValue}
            placeholder={`Enter "${currencyB}" amount`}
          />
          {NB && (<div className='exchange-card-currency__icon-nbu is-mobile'>
            <img src={require('../../assets/images/nb.png')} alt=""/>
            <span>НБУ</span>
          </div>)}
        </div>
      </Fragment>)}
      {/* <div className="exchange-card-currency__footer">
        1 {codeB} = {rate} {codeA}
      </div> */}
      {inputStatus && <HelperCount codeA={codeA} NB={NB} valueB={valueB} valueNBU={valueNBU2}/>}
    </div>
  );
};

export default ExchangeCardCurrency;
