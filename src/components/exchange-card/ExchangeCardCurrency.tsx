import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { inputFontSize } from '../../utils/helpers';
import { SN } from '../../types';
import Big from 'big.js';
import { toFix } from '../../utils/formatCurrency';
import { ReactComponent as IconArrow } from '../../assets/images/profits.svg';

interface IBaseProps {
  icon: string;
  codeA: string;
  codeB: string;
  currencyB: string;
  rate: SN | Big;
  value: any;
  valueB: any;
  setValue: any;
  grow?: Number;
  growTop: Boolean;
}

const ExchangeCardCurrency: FC<IBaseProps> = (props) => {
  const {
    icon,
    codeA,
    codeB,
    currencyB,
    rate,
    value,
    valueB,
    setValue,
    grow,
    growTop,
  } = props;

  const [inputStatus, setInputStatus] = useState(false);

  return (
    <div className="exchange-card-currency">
      <div className="exchange-card-currency__head">
        <span className="exchange-card-currency__currency">{codeB} </span>
        <div className="exchange-card-currency__row">
          <span className="exchange-card-currency__info">{currencyB}</span>
          <img className="exchange-card-currency__icon" src={icon} alt="" />
          {growTop && (
            <IconArrow
              className={classNames('exchange-card-currency__grow', {
                _up: grow === 1,
                _down: grow === -1,
              })}
            />
          )}
        </div>
        <div className="exchange-card-currency__rate">
          = {toFix(rate, 2)} {codeA}
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
        placeholder={`Введи кількість "${currencyB}"`}
      />
      <input
        onBlur={() => setInputStatus(false)}
        onFocus={() => setInputStatus(true)}
        style={{ fontSize: inputFontSize(value) }}
        type="number"
        className="exchange-card-currency__input exchange-card-currency__input--mobile"
        value={value}
        onChange={setValue}
        placeholder={`Введи кількість "${currencyB}"`}
      />
      <div className="exchange-card-currency__footer">
        1 {codeB} = {rate} {codeA}
        {!growTop && (
          <IconArrow
            className={classNames('exchange-card-currency__grow _absolute', {
              _up: grow === 1,
              _down: grow === -1,
            })}
          />
        )}
      </div>
      {inputStatus && (
        <span className="exchange-card-currency__computed fadeIn">
          {valueB} {codeA}
        </span>
      )}
    </div>
  );
};

export default ExchangeCardCurrency;
