import { Exchange } from '../../types';

const exchange: Exchange = {
  id: '',
  currencyCodeA: '',
  currencyCodeB: '',
  date: '',
  currencyA: {
    code: '',
    currency: '',
  },
  currencyB: {
    code: '',
    currency: '',
    country: ''
  }
};

const localExchanges: any = localStorage.getItem('exchange-v2');

const initialExchange: Exchange = localExchanges && localExchanges !== 'undefined'
  ? JSON.parse(localExchanges)
  : exchange;

export default initialExchange;
