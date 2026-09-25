import * as cc from 'currency-codes';
import moment from 'moment';
import getCountry from './currencyList';
import { Currency, Exchange, NBRate, SN } from '../types';
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
    currencyB: cc.code(base_ccy) as Currency,
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

/** Accepts "1 234,5" / "1234.5", returns a normalized string or null if invalid */
export const parseAmount = (input: string): string | null => {
  const value = input.replace(/[\s  ]/g, '').replace(',', '.');
  if (value === '') return '';
  if (!/^\d*\.?\d*$/.test(value)) return null;
  if (value.length > 16) return null;
  return value.startsWith('.') ? `0${value}` : value;
};

const groupThousands = (value: string) => {
  const [int, frac] = value.split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return frac !== undefined ? `${grouped}.${frac}` : grouped;
};

const significantDecimals = (value: Big, significant: number) => {
  const abs = value.abs();
  if (abs.eq(0) || abs.gte(1)) return 2;
  const exponent = Math.floor(Math.log10(Number(abs.toString())));
  return Math.min(12, -exponent + significant - 1);
};

const stripZeros = (value: string) =>
  value.includes('.') ? value.replace(/\.?0+$/, '') : value;

/** Human friendly amount: 2 decimals for normal values, ~5 significant digits for tiny ones */
export const formatAmount = (input: SN | Big | null | undefined) => {
  if (input === '' || input === null || input === undefined) return '';
  try {
    const value = new Big(input);
    const decimals = significantDecimals(value, 5);
    const fixed = value.toFixed(decimals);
    return groupThousands(decimals > 2 ? stripZeros(fixed) : fixed.replace(/\.00$/, ''));
  } catch {
    return '';
  }
};

/** Rate with enough precision to be useful: 45.4175, 0.02202, 0.00000026 */
export const formatRate = (input: SN | Big | null | undefined) => {
  if (input === '' || input === null || input === undefined) return '';
  try {
    const value = new Big(input);
    if (value.abs().gte(1000)) return groupThousands(value.toFixed(2));
    if (value.abs().gte(1)) return value.toFixed(4);
    return stripZeros(value.toFixed(significantDecimals(value, 4)));
  } catch {
    return '';
  }
};
