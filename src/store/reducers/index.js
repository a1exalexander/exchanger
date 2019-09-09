import { FETCH_CURRENCIES_REQUEST, FETCH_CURRENCIES_SUCCESS, FETCH_CURRENCIES_FAILURE, SET_EXCHANGE, TOGGLE_EXCHANGE_METHOD } from '../../constants';
import initialExchange from './exchange';

const toggleExchangeMethod = (method) => {
  return method === 'buy' ? 'sell' : 'buy';;
}

const setExchangeMethod = (item) => {
  return item.rateBuy ? 'buy' : 'cross';
}

const initialState = {
  currencies: [],
  loading: false,
  hasError: false,
  method: setExchangeMethod(initialExchange),
  exchange: {...initialExchange},
};

const reducer = (state = initialState, action) => {

  switch (action.type) {

    case FETCH_CURRENCIES_REQUEST:
      return {
        ...state,
        loading: true,
        hasError: false,
      }
    case FETCH_CURRENCIES_SUCCESS:
      return {
        ...state,
        currencies: [...action.payload],
        loading: false,
        hasError: false,
      }
    case FETCH_CURRENCIES_FAILURE:
      return {
        ...state,
        loading: false,
        hasError: true,
      }
    case SET_EXCHANGE:
      return {
        ...state,
        exchange: Object.assign({}, initialExchange, action.payload),
        method: setExchangeMethod(action.payload),
      }
    case TOGGLE_EXCHANGE_METHOD:
      return {
        ...state,
        method: toggleExchangeMethod(state.method),
      }
    default:
      return state;
  }
};

export default reducer;