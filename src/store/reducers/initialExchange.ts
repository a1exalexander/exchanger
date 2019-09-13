import { Exchange } from '../types';

const exchange: Exchange = {
  currencyCodeA: '',
  currencyCodeB: '',
  date: '',
  rateBuy: '',
  rateSell: '',
  rateCross: '',
  currencyA: {
    code: '',
    number: '',
    digits: '',
    currency: '',
    countries: [],
    country: ''
  },
  currencyB: {
    code: '',
    number: '',
    digits: '',
    currency: '',
    countries: [],
    country: ''
  }
};

const localExchanges: any = localStorage.getItem('exchange')

const initialExchange: Exchange = localStorage.getItem('exchange')
  ? JSON.parse(localExchanges)
  : exchange;

export default initialExchange;
