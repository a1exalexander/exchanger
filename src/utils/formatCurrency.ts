import * as cc from 'currency-codes';
import moment from 'moment';
import getCountry from './currencyList';
import { Exchange, NBRate, SN } from '../types';
import Big from 'big.js';
import { has } from './helpers';

const cryptocurrencies = require('cryptocurrencies');

export const getUahBtc = (cash: Array<Exchange>, crypto: Array<Exchange>) => {
  const USD: Exchange | undefined = cash.find(
    (item) => item.currencyA.code === 'USD' && item.currencyB.code === 'UAH'
  );
  const BTC: Exchange | undefined = crypto.find(
    (item) => item.currencyA.code === 'BTC' && item.currencyB.code === 'USD'
  );
  if (
    USD &&
    BTC &&
    USD.rateBuy &&
    BTC.rateBuy &&
    USD.rateSell &&
    BTC.rateSell
  ) {
    const newExchange = {
      id: `${USD.currencyCodeA}:${BTC.currencyCodeA}`,
      precision: 4,
      currencyCodeA: BTC.currencyCodeA,
      rateBuy: new Big(USD.rateBuy).mul(BTC.rateBuy).round(4).toString(),
      rateSell: new Big(USD.rateSell).mul(BTC.rateSell).round(4).toString(),
      currencyA: BTC.currencyA,
    };
    return { ...USD, ...newExchange } as Exchange;
  }

  return undefined;
};

export const mapCurrencies = (item: any) => {
  const { currencyCodeA, currencyCodeB } = item;
  let newItem = {
    ...item,
    id: `${currencyCodeA}:${currencyCodeB}`,
    precision: 4,
    currencyA: cc.number(currencyCodeA) || {},
    currencyB: cc.number(currencyCodeB) || {},
    date: moment(item.date, 'X').format('DD MMMM YYYY'),
  };
  newItem.currencyA.country = has(newItem.currencyA, 'code')
    ? getCountry(newItem.currencyA.code)
    : '';
  newItem.currencyB.country = has(newItem.currencyB, 'code')
    ? getCountry(newItem.currencyB.code)
    : '';
  return newItem;
};

export const getSyncCash = (MONOCurrencies = [], NBCurrencies = []) => {
  const result = MONOCurrencies.map((item: Exchange) => {
    const {
      currencyA: { code = '' },
    } = item;
    const extra: NBRate | undefined = NBCurrencies.find(
      ({ cc = '' }) => cc === code
    );
    const result = {...item};
    if (extra) result.NB = extra;
    return result;
  });
  return result;
};

export const filterCurrencies = (item: any) => {
  const { currencyA, currencyB } = item;
  return has(currencyA, 'code') && has(currencyB, 'code');
};

export const mapBTC = (item: any) => {
  const { base_ccy, ccy } = item;
  let newItem: Exchange = {
    id: `${ccy}:${base_ccy}`,
    precision: 6,
    currencyCodeA: ccy,
    currencyCodeB: base_ccy,
    rateBuy: Number(item.buy),
    rateSell: Number(item.sale),
    currencyA: {
      code: ccy,
      currency: cryptocurrencies[ccy],
    },
    currencyB: cc.code(base_ccy),
  };
  return newItem;
};

const formatCurrency = (currencyCode: string) => {
  const newItem: any = cc.number(currencyCode);
  newItem.country = getCountry(newItem.code);
  return newItem;
};

const cutNumber = (num: SN, precision: number) => {
  if (!precision) return Math.round(Number(num));
  const x: string = String(num);
  const idx = x.indexOf('.');
  const decimals = x.substr(idx + 1, precision);
  const int = x.slice(0, idx);
  return `${int}.${decimals}`;
};

const removeZero = (num: SN) => {
  let x = String(num);
  return x.length > 1 && x[0] === '0' ? x.slice(1) : x;
};

export const toFix = (num: any, precision: number = 4) => {
  if (Number.isNaN(Number(num))) return '';
  let x = String(num);
  return ~x.indexOf('.') ? cutNumber(x, precision) : removeZero(x);
};

export const setNumber = (fn: any) => (val: any, precision: number) => {
  const fixedValue = toFix(val, precision);
  if (fixedValue || val === '') {
    fn(fixedValue);
  }
};

export default formatCurrency;
