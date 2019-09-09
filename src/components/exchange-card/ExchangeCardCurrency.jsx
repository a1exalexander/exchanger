import React from 'react';

const ExchangeCardCurrency = ({ icon, codeA, codeB, currencyB, rate, value, setValue }) => {

  return (
    <div className="exchange-card-currency">
      <div className="exchange-card-currency__head">
        <span className="exchange-card-currency__currency">
          {codeB}
        </span>
        <div className="exchange-card-currency__row">
          <span className="exchange-card-currency__info">
            {currencyB}
          </span>
          <object
            type="image/svg+xml"
            data={icon}
            className="exchange-card-currency__icon"
          >
          </object>
        </div>
      </div>
      <input type="text" className="exchange-card-currency__input" value={value} onChange={setValue}/>
      <div className="exchange-card-currency__footer">
        1 {codeB} = {rate} {codeA}
      </div>
    </div>
  );
};

export default ExchangeCardCurrency;