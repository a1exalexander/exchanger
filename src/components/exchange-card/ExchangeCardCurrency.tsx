import React, { useState, FC } from 'react';
import { inputFontSize } from '../../utils/helpers';
import { SN } from '../../types';
import Big from 'big.js';

interface ExchangeCardCurrencyProps {
  icon: string;
  codeA: string;
  codeB: string;
  currencyB: string;
  rate: SN | Big;
  value: any;
  setValue: any;
  startInput: () => any;
  endInput: () => any;
}

const ExchangeCardCurrency: FC<ExchangeCardCurrencyProps> = props => {
  const {
    icon,
    codeA,
    codeB,
    currencyB,
    rate,
    value,
    setValue,
    startInput,
    endInput
  } = props;

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
        onBlur={endInput}
        onFocus={startInput}
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
    </div>
  );
};

export default ExchangeCardCurrency;
