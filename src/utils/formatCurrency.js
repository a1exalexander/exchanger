import * as cc from 'currency-codes';
import moment from 'moment';
import getCountry from './currencyList';

export const mapCurrencies = (item) => {
  let newItem = {...item};
  newItem.currencyA = cc.number(item.currencyCodeA);
  newItem.currencyB = cc.number(item.currencyCodeB);
  newItem.date = moment(item.date, 'X').format('DD MMMM YYYY');
  newItem.currencyA.country = getCountry(newItem.currencyA.code);
  newItem.currencyB.country = getCountry(newItem.currencyB.code);
  return newItem;
};

const formatCurrency = (currencyCode) => {
  const newItem = cc.number(currencyCode);
  newItem.country = getCountry(newItem.code);
  return newItem;
};

export default formatCurrency;