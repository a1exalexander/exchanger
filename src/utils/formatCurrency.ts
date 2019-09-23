import * as cc from 'currency-codes';
import moment from 'moment';
import getCountry from './currencyList';
import { Exchange, SN } from '../types';
import Big  from 'big.js';

const cryptocurrencies = require('cryptocurrencies');

export const getUahBtc = (cash: Array<Exchange>, crypto: Array<Exchange>) => {
  const id = String(Math.floor((Math.random() * Date.now()) + 1));
  const USD: any = cash.find((item) => item.currencyA.code === 'USD' && item.currencyB.code === 'UAH');
  const BTC: any = crypto.find((item) => item.currencyA.code === 'BTC' && item.currencyB.code === 'USD');
  const newExchange = {
    id,
    precision: 6,
    currencyCodeA: BTC.currencyCodeA,
    rateBuy: new Big(USD.rateBuy).mul(BTC.rateBuy).round(6).toString(),
    rateSell: new Big(USD.rateSell).mul(BTC.rateSell).round(6).toString(),
    currencyA: BTC.currencyA,
  };
  return Object.assign({}, USD, newExchange);
}

export const mapCurrencies = (item: any) => {
  const id = String(Math.floor((Math.random() * Date.now()) + 1));
  let newItem = {
    ...item,
    id,
    precision: 4,
    currencyA: cc.number(item.currencyCodeA),
    currencyB: cc.number(item.currencyCodeB),
    date: moment(item.date, 'X').format('DD MMMM YYYY'),
  };
  newItem.currencyA.country = getCountry(newItem.currencyA.code);
  newItem.currencyB.country = getCountry(newItem.currencyB.code);
  return newItem;
};

export const mapBTC = (item: any) => {
  const id = String(Math.floor((Math.random() * Date.now()) + 1));
  let newItem:Exchange = {
    id,
    precision: 6,
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

export const toFix = (val: SN | Big, pre = 4) => val ? new Big(val).round(pre) : '';

export default formatCurrency;