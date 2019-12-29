import React, { FC, useState } from 'react';
import { inputFontSize } from '../../utils/helpers';
import { SN } from '../../types';
import Big from 'big.js';
import { toFix } from '../../utils/formatCurrency';

interface IBaseProps {
  icon: string;
  codeA: string;
  codeB: string;
  currencyB: string;
  rate: SN | Big;
  value: any;
  valueB: any;
  precision: number;
  setValue: any;
}

const ExchangeCardCurrency: FC<IBaseProps> = props => {
  const {
    icon,
    codeA,
    codeB,
    precision,
    currencyB,
    rate,
    value,
    valueB,
    setValue,
  } = props;

  const [inputStatus, setInputStatus] = useState(false);

  return (
    <div className="exchange-card-currency">
      <div className="exchange-card-currency__head">
        <span className="exchange-card-currency__currency">{codeB}</span>
        <div className="exchange-card-currency__row">
          <span className="exchange-card-currency__info">{currencyB}</span>
          <img className="exchange-card-currency__icon" src={icon} alt=""/>
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
      <div className="exchange-card-currency__footer">
        1 {codeB} = {rate} {codeA}
      </div>
      {inputStatus && (
        <span
          className="exchange-card-currency__computed fadeIn"
          >{toFix(valueB, precision)} {codeA}
        </span>)}
    </div>
  );
};

export default ExchangeCardCurrency;
