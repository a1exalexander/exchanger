import React, { Fragment, useState } from 'react';
import { Select, Popover } from 'antd';
import { setExchange } from '../../store/actions';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Currencies, Exchange, Currency, SN } from '../../types';
import { ExchangesState } from '../../store/types';
import getIcon from '../../utils/getIcon';
import { ReactComponent as IconExchange } from '../../assets/images/exchange-arrows.svg';

const { Option }: any = Select;

const filterOption = (inputValue: string, option: any) => {
  return (
    option.props.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
    option.props.children.props.children.some((item: any) => {
      if (typeof item === 'string') {
        return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
      }
      return (
        String(item.props.children)
          .toLowerCase()
          .indexOf(inputValue.toLowerCase()) >= 0
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
  setExchange,
}: SelectCardProps) => {
  const {
    currencyA: { code: codeA, currency: currencyA, country: countryA = '' },
    currencyB: { code: codeB, currency: currencyB, country: countryB = '' },
  } = exchange as Exchange;

  const [isOpen, setIsOpen] = useState(false);

  const CountriesList = ({ cid }: { cid: SN }) => {
    const exchange = currencies.find(({ id }: Exchange) => id === cid) || {
      currencyA: { countries: [] },
    };

    const { countries = [] } = exchange.currencyA;

    return (
      <ul className="select-card__countries">
        {countries.map((country) => (
          <li key={country}>
            <a
              rel="noopener noreferrer"
              data-posthog-link="google"
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

  const renderSelectList = (hasPopover = true) =>
    currencies.map((item, index) => {
      const {
        currencyA: { code, currency },
        id,
        currencyB,
        NB,
      }: Exchange = item;
      const content = (
        <>
          {currencyB.code !== 'UAH' ? (
            <>
              <b>{currencyB.code}</b> {currencyB.currency}
              {' - '}
            </>
          ) : (
            ''
          )}
          <b>{code}</b>{' '}
          <span className="select-card__currency">
            {NB ? NB.txt : currency}
          </span>
        </>
      );
      return (
        <Option key={id} value={id} label={code}>
          {hasPopover ? (
            <Popover
              overlayClassName="select-card__popover"
              placement="left"
              showArrow={false}
              title={currency}
              content={<CountriesList cid={id} />}
              trigger="hover"
            >
              {content}
            </Popover>
          ) : (
            content
          )}
        </Option>
      );
    });

  const getValue = (exchange: Exchange) => {
    const {
      NB,
      currencyB: { code },
      currencyA,
    } = exchange;
    return `${code !== 'UAH' ? code + ' - ' : ''}${currencyA.code} ${
      NB ? NB.txt : currencyA.currency
    }`;
  };

  return (
    <div className="select-card">
      <p className="select-card__title">Обери валюту</p>
      <Select
        showSearch
        className="select-card__select"
        popupClassName="select-card__dropdown"
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
        {renderSelectList()}
      </Select>
      <div className={`select-card__select-wrapper`} id="select">
        <div className="select-card__select-inner">
          <div className={cx('select-card__placeholder', { _hidden: isOpen })}>
            <h1 className="select-card__caption">UAH Excahnger</h1>
            <div className="select-card__placeholder-item">
              <img
                className="select-card__icon select-card__icon--m-right"
                src={getIcon(countryA, codeA)}
                alt=""
              />
              {currencyA}
            </div>
            <IconExchange className={'select-card__icon-middle'} />
            <div className="select-card__placeholder-item select-card__placeholder-item--right">
              {currencyB}
              <img
                className="select-card__icon select-card__icon--m-left"
                src={getIcon(countryB, codeB)}
                alt=""
              />
            </div>
          </div>
          <Select
            showSearch
            suffixIcon={null}
            popupClassName="select-card__select-mobile-popover"
            className={cx('select-card__select-mobile', { _open: isOpen })}
            optionFilterProp="children"
            optionLabelProp="label"
            size="large"
            loading={loading}
            open={isOpen}
            value=""
            onDropdownVisibleChange={setIsOpen}
            onChange={setExchange}
            filterOption={filterOption}
          >
            {renderSelectList(false)}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ exchange, currencies, loading, computedCurrency }: ExchangesState) => {
    return { exchange, currencies, loading, computedCurrency };
  },
  { setExchange },
)(SelectCard);
