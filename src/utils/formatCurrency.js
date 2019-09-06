import * as cc from 'currency-codes';
import moment from 'moment';

export const mapCurrencies = (item) => {
  let newItem = {...item};
  newItem.currencyA = cc.number(item.currencyCodeA);
  newItem.currencyB = cc.number(item.currencyCodeB);
  newItem.date = moment(item.date, 'X').format('DD MMMM YYYY');
  return newItem;
};

const formatCurrency = (currencyCode) => {
  const newItem = cc.number(currencyCode);
  return newItem;
};

export default formatCurrency;