import {
  SET_LAST_UPDATE,
  FETCH_CURRENCIES_REQUEST,
  FETCH_CURRENCIES_SUCCESS,
  FETCH_CURRENCIES_FAILURE,
  TOGGLE_EXCHANGE_METHOD,
  SET_THEME,
  SET_PAIR,
  SET_CURRENCY,
  SWAP_PAIR,
  SET_METHOD,
  SET_MARKET_RATES,
} from '../../constants';
import { ExchangesState } from '../types';
import { Exchange } from '../../types';
import { currenciesStorage, exchangeStorage } from '../../services';
import { resolveExchange } from '../../utils/resolveExchange';

/** Pick up the pair chosen in the previous version of the app */
const initialPair = () => {
  const legacy: Exchange | null = exchangeStorage.get();
  const from = legacy?.currencyA?.code;
  const to = legacy?.currencyB?.code;
  return from && to && from !== to ? { from, to } : { from: 'USD', to: 'UAH' };
};

const initialState: ExchangesState = {
  lastUpdate: '',
  currencies: [...(currenciesStorage.get() || [])],
  market: null,
  loading: false,
  hasError: false,
  method: 'buy',
  pair: initialPair(),
  theme: 'light',
};

/** Buy / sell only make sense when the bank quotes both sides */
const withValidMethod = (state: ExchangesState): ExchangesState => {
  const exchange = resolveExchange(state.pair, state.currencies, state.market);
  if (!exchange) return state;
  const hasBuySell = !!exchange.rateBuy && !!exchange.rateSell;
  if (!hasBuySell) {
    return state.method === 'cross' ? state : { ...state, method: 'cross' };
  }
  return state.method === 'cross' ? { ...state, method: 'buy' } : state;
};

const reducer = (
  state: ExchangesState = initialState,
  action: any,
): ExchangesState => {
  switch (action.type) {
    case FETCH_CURRENCIES_REQUEST:
      return {
        ...state,
        loading: true,
        hasError: false,
      };
    case FETCH_CURRENCIES_SUCCESS:
      return withValidMethod({
        ...state,
        currencies: [...action.payload],
        loading: false,
        hasError: false,
      });
    case FETCH_CURRENCIES_FAILURE:
      return {
        ...state,
        loading: false,
        hasError: true,
      };
    case SET_MARKET_RATES:
      return withValidMethod({
        ...state,
        market: action.payload,
      });
    case SET_PAIR:
      return withValidMethod({
        ...state,
        pair: { ...action.payload },
      });
    case SET_CURRENCY: {
      const { side, code } = action.payload as {
        side: 'from' | 'to';
        code: string;
      };
      const other = side === 'from' ? 'to' : 'from';
      const pair =
        state.pair[other] === code
          ? { from: state.pair.to, to: state.pair.from }
          : { ...state.pair, [side]: code };
      return withValidMethod({ ...state, pair });
    }
    case SWAP_PAIR:
      // the same deal seen from the other side: buying USD for UAH is selling UAH
      return withValidMethod({
        ...state,
        pair: { from: state.pair.to, to: state.pair.from },
        method:
          state.method === 'cross' ? 'cross' : state.method === 'buy' ? 'sell' : 'buy',
      });
    case SET_METHOD:
      return withValidMethod({
        ...state,
        method: action.payload,
      });
    case TOGGLE_EXCHANGE_METHOD:
      return withValidMethod({
        ...state,
        method: state.method === 'buy' ? 'sell' : 'buy',
      });
    case SET_LAST_UPDATE:
      return {
        ...state,
        lastUpdate: action.payload,
      };
    case SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
