import * as cc from 'currency-codes';
import moment from 'moment';
import getCountry from './currencyList';
import { Exchange, SN } from '../types';
import { Decimal } from 'decimal.js';

const cryptocurrencies = require('cryptocurrencies');

export const getUahBtc = (cash: Array<Exchange>, crypto: Array<Exchange>) => {
  const id = String(Math.floor((Math.random() * Date.now()) + 1));
  const USD: any = cash.find((item) => item.currencyA.code === 'USD' && item.currencyB.code === 'UAH');
  const BTC: any = crypto.find((item) => item.currencyA.code === 'BTC' && item.currencyB.code === 'USD');
  const newExchange = {
    id,
    precision: 6,
    currencyCodeA: BTC.currencyCodeA,
    rateBuy: Decimal.mul(USD.rateBuy, BTC.rateBuy).toFixed(6),
    rateSell: Decimal.mul(USD.rateSell, BTC.rateSell).toFixed(6),
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

export const toFix = (val: SN | Decimal, pre = 4) => {
  const max = Number.MAX_SAFE_INTEGER;
  if (val && pre > 4) {
    return new Decimal(val).toFixed(pre);
  }
  if (val) {
    return new Decimal(val).toDP(pre, Decimal.ROUND_DOWN).toNumber(); 
  }
  return '';
}

export default formatCurrency;