import React from 'react';
import { Select } from 'antd';
import { setExchange } from '../../store/actions';
import { connect } from 'react-redux';
const { Option } = Select;

const filterOption = (input, option) => {
  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const mapedOptions = (options) => {
  const newList = options.filter(({ currencyCodeB }) => currencyCodeB === 980);
  return newList.map((item, index) => { 
    const { currencyA: { code, currency } } = item;
    return (<Option key={index+code} value={code} label={code}><b>{code}</b> {currency}</Option>)
  });
}

const SelectCard = ({ exchange, currencies, loading, setExchange }) => {

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

const mapStateToProps = ({ exchange, currencies, loading }) => {
  return { exchange, currencies, loading }
}

const mapDispatchToProps = {
  setExchange,
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCard);
