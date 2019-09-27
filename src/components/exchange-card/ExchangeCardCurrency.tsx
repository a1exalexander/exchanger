import React, { FC, useState } from 'react';
import { inputFontSize } from '../../utils/helpers';
import { SN } from '../../types';
import Big from 'big.js';

interface IBaseProps {
  icon: string;
  codeA: string;
  codeB: string;
  currencyB: string;
  rate: SN | Big;
  value: any;
  valueB: any;
  setValue: any;
}

const ExchangeCardCurrency: FC<IBaseProps> = props => {
  const {
    icon,
    codeA,
    codeB,
    currencyB,
    rate,
    value,
    valueB,
    setValue,
  } = props;

  const [inputStatus, setInputStatus] = useState(false);

  const computedValue = () => {
    if (inputStatus) {
      return (
        <span
          className="exchange-card-currency__computed fadeIn"
          >{valueB || 0} {codeA}
        </span>);
    }
  }

  return (
    <div className="exchange-card-currency">
      <div className="exchange-card-currency__head">
        <span className="exchange-card-currency__currency">{codeB}</span>
        <div className="exchange-card-currency__row">
          <span className="exchange-card-currency__info">{currencyB}</span>
          <object
            type="image/svg+xml"
            data={icon}
            className="exchange-card-currency__icon"
          >icon</object>
        </div>
        <div className="exchange-card-currency__rate">
          = {rate} {codeA}
        </div>
      </div>
      <input
        title="asd"
        onBlur={() => setInputStatus(false)}
        onFocus={() => setInputStatus(true)}
        style={{ fontSize: inputFontSize(value) }}
        type="text"
        className="exchange-card-currency__input"
        value={value}
        onChange={setValue}
        placeholder={`Enter "${currencyB}" amount`}
      />
      <div className="exchange-card-currency__footer">
        1 {codeB} = {rate} {codeA}
      </div>
      {computedValue()}
    </div>
  );
};

export default ExchangeCardCurrency;
