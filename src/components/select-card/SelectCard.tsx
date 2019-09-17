import React from 'react';
import { Select } from 'antd';
import { setExchange } from '../../store/actions';
import { connect } from 'react-redux';
import { Currencies, Exchange } from '../../types';
import { ExchangesState } from '../../store/types';
const { Option }: any = Select;

const filterOption = (inputValue: string, option: any) => {
  return option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
};

interface SelectCardProps {
  exchange: Exchange;
  currencies: Currencies;
  loading: boolean;
  setExchange: any;
}

const SelectCard = ({ exchange, currencies, loading, setExchange }: SelectCardProps) => {

  return (
    <div className="select-card">
      <p className="select-card__title">Сurrency selection</p>
      <Select
        showSearch
        className="select-card__select"
        placeholder="Select a currency"
        optionFilterProp="children"
        defaultValue={exchange.currencyA.code}
        optionLabelProp="label"
        size='large'
        loading={loading}
        value={exchange.currencyA.code}
        onChange={setExchange}
        filterOption={filterOption}
      >
        {currencies.map((item, index) => { 
          const { currencyA: { code, currency }, id, currencyB, }: Exchange = item;
          return (<Option key={id} value={id} label={code}><b>{currencyB.code}</b> - <b>{code}</b> {currency}</Option>)
        })}
      </Select>
    </div>
  );
};

export default connect(
  ({ exchange, currencies, loading }: ExchangesState) => {
    return { exchange, currencies, loading }
  },
  { setExchange }
)(SelectCard);
