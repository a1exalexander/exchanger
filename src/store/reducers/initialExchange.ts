import { exchangeStorage } from '../../services';
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
    country: '',
  },
};

const localExchanges: Exchange | null = exchangeStorage.get();

const initialExchange: Exchange = localExchanges ? localExchanges : exchange;

export default initialExchange;
