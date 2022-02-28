import React, { Fragment } from "react";
import { Select, Popover } from "antd";
import { setExchange } from "../../store/actions";
import { connect } from "react-redux";
import { Currencies, Exchange, Currency, SN } from "../../types";
import { ExchangesState } from "../../store/types";
import getIcon from "../../utils/getIcon";
import { ReactComponent as IconExchange } from "../../assets/images/exchange-arrows.svg";

const { Option }: any = Select;

const filterOption = (inputValue: string, option: any) => {
  return (
    option.props.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
    option.props.children.props.children.some((item: any) => {
      if (typeof item === "string") {
        return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
      }
      return (
        String(item.props.children).toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
      );
    })
  );
};

interface SelectCardProps {
  exchange: Exchange;
  currencies: Currencies;
  loading: boolean;
  setExchange: any;
  computedCurrency: Currency;
}

const SelectCard = ({
  exchange,
  currencies,
  loading,
  setExchange
}: SelectCardProps) => {
  const {
    currencyA: { code: codeA, currency: currencyA, country: countryA = "" },
    currencyB: { code: codeB, currency: currencyB, country: countryB = "" }
  } = exchange as Exchange;

  const CountriesList = ({ cid }: { cid: SN }) => {
    const exchange = currencies.find(({ id }: Exchange) => id === cid) || {
      currencyA: { countries: [] }
    };

    const { countries = [] } = exchange.currencyA;

    return (
      <ul className="select-card__countries">
        {countries.map(country => (
          <li key={country}>
            <a
              rel="noopener noreferrer"
              href={`https://www.google.com/search?q=${country}`}
              target="_blank"
            >
              {country}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  const selectList = currencies.map((item, index) => {
    const {
      currencyA: { code, currency },
      id,
      currencyB,
      NB
    }: Exchange = item;
    return (
      <Option key={id} value={id} label={code}>
        <Popover
          placement="left"
          title={currency}
          content={<CountriesList cid={id} />}
          trigger="hover"
        >
          {currencyB.code !== "UAH" ? (
            <Fragment>
              <b>{currencyB.code}</b> {currencyB.currency}
              {" - "}
            </Fragment>
          ) : (
            ""
          )}
          <b>{code}</b> {NB ? NB.txt : currency}
        </Popover>
      </Option>
    );
  });

  const getValue = (exchange: Exchange) => {
    const { NB, currencyB: { code }, currencyA } = exchange;
    return `${code !== 'UAH' ? code + ' - ' : ''}${currencyA.code} ${NB ? NB.txt : currencyA.currency}`;
  }

  return (
    <div className="select-card">
      <p className="select-card__title">Обери валюту</p>
      <Select
        showSearch
        className="select-card__select"
        placeholder="Select a currency"
        optionFilterProp="children"
        defaultValue={exchange.id}
        optionLabelProp="label"
        size="large"
        loading={loading}
        value={getValue(exchange)}
        onChange={setExchange}
        filterOption={filterOption}
      >
        {selectList}
      </Select>
      <div className={`select-card__select-wrapper`} id="select">
        <div className="select-card__select-inner">
          <div className="select-card__placeholder">
            <h1 className="select-card__caption">Русский корабль, иди нахуй!</h1>
            <div className="select-card__placeholder-item">
              <img
                className="select-card__icon select-card__icon--m-right"
                src={getIcon(countryA, codeA)}
                alt=""
              />
              {currencyA}
            </div>
            <IconExchange className={"select-card__icon-middle"} />
            <div className="select-card__placeholder-item select-card__placeholder-item--right">
              {currencyB}
              <img
                className="select-card__icon select-card__icon--m-left"
                src={getIcon(countryB, codeB)}
                alt=""
              />
            </div>
          </div>
          <select
            name="currencies"
            value={exchange.id}
            onChange={(e: any) => {
              const v = e.target.value;
              setExchange(v);
            }}
            className="select-card__select-input"
          >
            {currencies.map(item => {
              return (
                <option key={item.id} value={item.id}>{getValue(item)}</option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ exchange, currencies, loading, computedCurrency }: ExchangesState) => {
    return { exchange, currencies, loading, computedCurrency };
  },
  { setExchange }
)(SelectCard);
