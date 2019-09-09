const exchange = {
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

const initialExchange = localStorage.getItem('exchange')
  ? JSON.parse(localStorage.getItem('exchange'))
  : exchange;

export default initialExchange;
