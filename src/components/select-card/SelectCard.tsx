import React, { useEffect, useState, Fragment } from 'react';
import { Select } from 'antd';
import { setExchange } from '../../store/actions';
import { connect } from 'react-redux';
import { Currencies, Exchange, SN, Currency } from '../../types';
import { ExchangesState } from '../../store/types';
import getIcon from '../../utils/getIcon';
import appLogo from '../../assets/images/currencies.svg';
import { toFix } from '../../utils/formatCurrency';

const { Option }: any = Select;

const filterOption = (inputValue: string, option: any) => {
  return option.props.children.some((item: any) => {
    if (typeof item === 'string') {
      return item.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
    }
    return item.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  })
};

interface SelectCardProps {
  exchange: Exchange;
  currencies: Currencies;
  loading: boolean;
  setExchange: any;
  computedCurrency: Currency;
}

const SelectCard = ({ exchange, currencies, loading, setExchange, computedCurrency }: SelectCardProps) => {

  const {
    currencyA: { code: codeA, currency: currencyA, country: countryA = '' },
    currencyB: { code: codeB, currency: currencyB, country: countryB = '' }
  } = exchange as Exchange;

  const selectBar = (
    <div className='select-card__placeholder-bar'>
      <div className='select-card__placeholder-item'>
        <object
          type="image/svg+xml"
          data={getIcon(countryA, codeA)}
          className="select-card__icon select-card__icon--m-right"
        >
        </object>
        { currencyA }
      </div>
      <i className="fas fa-exchange-alt select-card__icon-middle"></i>
      <div className='select-card__placeholder-item select-card__placeholder-item--right'>
      { currencyB }
        <object
          type="image/svg+xml"
          data={getIcon(countryB, codeB)}
          className="select-card__icon select-card__icon--m-left"
        >
        </object>
      </div>
    </div>
  );

  const computedBar = (
    <div className='select-card__computed-bar'>
      <div className='select-card__row'>
        <object
          type="image/svg+xml"
          data={getIcon(computedCurrency.country || '', computedCurrency.code)}
          className="select-card__icon select-card__icon--m-right"
        >
        </object>
        { computedCurrency.currency }
      </div>
      <span className='select-card__computed-value'>{toFix(computedCurrency.computedPrice, exchange.precision)}</span>
    </div>
  );

  const topBar = computedCurrency.computedPrice === null ? selectBar : computedBar;

  return (
    <div className="select-card">
      <p className="select-card__title">Сurrency selection</p>
      <Select
        showSearch
        className="select-card__select"
        placeholder="Select a currency"
        optionFilterProp="children"
        defaultValue={exchange.id}
        optionLabelProp="label"
        size='large'
        loading={loading}
        value={`${exchange.currencyB.code} - ${exchange.currencyA.code} ${exchange.currencyA.currency}`}
        onChange={setExchange}
        filterOption={filterOption}
      >
        {currencies.map((item, index) => { 
          const { currencyA: { code, currency }, id, currencyB, }: Exchange = item;
          return (<Option key={id} value={id} label={code}><b>{currencyB.code}</b> - <b>{code}</b> {currency}</Option>)
        })}
      </Select>
      <div className={`select-card__select-wrapper`} id='select'>
        <div className='select-card__select-inner'>
          <div className='select-card__placeholder'>
            <h1 className='select-card__caption'>UAH Excahnger</h1>
            {topBar}
          </div>
          <select
            name='currencies'
            value={exchange.id}
            onChange={(e: any) => {
              const v = e.target.value;
              setExchange(v);
            }}
            className='select-card__select-input'>
            {
              currencies.map((item) => { 
                const { currencyA: { code, currency }, id, currencyB, }: Exchange = item;
                return (<option key={id} value={id}>{currencyB.code} - {code} {currency}</option>)
              })
            }
          </select>
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ exchange, currencies, loading, computedCurrency }: ExchangesState) => {
    return { exchange, currencies, loading, computedCurrency }
  },
  { setExchange }
)(SelectCard);
