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

const mapedOptions = (currencies: Currencies): any => {
  const newList = currencies.filter(({ currencyCodeB }): boolean => currencyCodeB === 980);
  return newList.map((item, index) => { 
    const { currencyA: { code, currency } }: Exchange = item;
    return (<Option key={index+code} value={code} label={code}><b>{code}</b> {currency}</Option>)
  });
}

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
        loading={loading}
        value={exchange.currencyA.code}
        onChange={setExchange}
        filterOption={filterOption}
      >
        {mapedOptions(currencies)}
      </Select>
    </div>
  );
};

const mapStateToProps = ({ exchange, currencies, loading }: ExchangesState) => {
  return { exchange, currencies, loading }
}

const mapDispatchToProps = {
  setExchange,
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCard);
