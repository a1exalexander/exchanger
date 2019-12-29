import React, { FC, useState, useEffect } from "react";
import { inputFontSize } from "../../utils/helpers";
import { SN } from "../../types";
import Big from "big.js";

interface IHelperProps {
  codeA: string;
  valueB: SN;
}

const HelperCount: FC<IHelperProps> = props => {
  const { codeA, valueB } = props;

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
      {valueB} {codeA}
    </span>
  ) : null;
};

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
    setValue
  } = props;

  const [inputStatus, setInputStatus] = useState(false);

  return (
    <div className="exchange-card-currency">
      <div className="exchange-card-currency__head">
        <span className="exchange-card-currency__currency">{codeB}</span>
        <div className="exchange-card-currency__row">
          <span className="exchange-card-currency__info">{currencyB}</span>
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
      {inputStatus && <HelperCount codeA={codeA} valueB={valueB} />}
    </div>
  );
};

export default ExchangeCardCurrency;
