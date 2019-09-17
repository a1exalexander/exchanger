import * as cc from 'currency-codes';
import moment from 'moment';
import getCountry from './currencyList';
import { Exchange } from '../types';
import { Decimal } from 'decimal.js';

const cryptocurrencies = require('cryptocurrencies');

export const getUahBtc = (cash: Array<Exchange>, crypto: Array<Exchange>) => {
  const id = Math.floor((Math.random() * Date.now()) + 1);
  const USD: any = cash.find((item) => item.currencyA.code === 'USD' && item.currencyB.code === 'UAH');
  const BTC: any = crypto.find((item) => item.currencyA.code === 'BTC' && item.currencyB.code === 'USD');
  const newExchange = {
    id,
    currencyCodeA: BTC.currencyCodeA,
    rateBuy: Decimal.mul(USD.rateBuy, BTC.rateBuy).toFixed(4),
    rateSell: Decimal.mul(USD.rateSell, BTC.rateSell).toFixed(4),
    currencyA: BTC.currencyA,
  };
  return Object.assign({}, USD, newExchange);
}

export const mapCurrencies = (item: any) => {
  const id = Math.floor((Math.random() * Date.now()) + 1);
  let newItem = {...item};
  newItem.id = id;
  newItem.currencyA = cc.number(item.currencyCodeA);
  newItem.currencyB = cc.number(item.currencyCodeB);
  newItem.date = moment(item.date, 'X').format('DD MMMM YYYY');
  newItem.currencyA.country = getCountry(newItem.currencyA.code);
  newItem.currencyB.country = getCountry(newItem.currencyB.code);
  return newItem;
};

export const mapBTC = (item: any) => {
  const id = Math.floor((Math.random() * Date.now()) + 1);
  let newItem:Exchange = {
    id,
    currencyCodeA: item.ccy,
    currencyCodeB: item.base_ccy,
    rateBuy: Number(item.buy),
    rateSell: Number(item.sale),
    currencyA: {
      code: item.ccy,
      currency: cryptocurrencies[item.ccy],
    },
    currencyB: cc.code(item.base_ccy),
  };
  return newItem;
};

const formatCurrency = (currencyCode: string) => {
  const newItem: any = cc.number(currencyCode);
  newItem.country = getCountry(newItem.code);
  return newItem;
};


export default formatCurrency;