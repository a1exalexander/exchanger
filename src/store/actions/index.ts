import {
  FETCH_CURRENCIES_REQUEST,
  FETCH_CURRENCIES_SUCCESS,
  FETCH_CURRENCIES_FAILURE,
  SET_EXCHANGE
} from '../../constants';
import { ActionTypes } from '../types';
import { Exchange, Currencies } from '../../types';
import ApiService from '../../services/apiService';
import { getUahBtc } from '../../utils/formatCurrency';
const apiService = new ApiService();

const fetchCurrenciesSuccess = (payload: Currencies) => {
  return {
    type: FETCH_CURRENCIES_SUCCESS,
    payload
  };
};

const setExchange = (payload: string | Exchange) => (dispatch: any, getState: any) => {
  let exchange;
  if (typeof payload === 'string' || typeof payload === 'number') {
    exchange = getState().currencies.find((item: Exchange) => String(item.id) === String(payload));
  } else {
    exchange = payload;
  }
  localStorage.setItem('exchange', JSON.stringify(exchange));
  dispatch({
    type: SET_EXCHANGE,
    payload: exchange,
  } as ActionTypes);
};

const fetchCurrencies = () => async (dispatch: any, getState: any) => {
  dispatch(FETCH_CURRENCIES_REQUEST);
  try {
    const cash = await apiService.fetchCurrencies();
    const crypto = await apiService.fetchBTC();
    const uahBtc = getUahBtc(cash, crypto);
    const currencies = [...cash, ...crypto, uahBtc];
    dispatch(fetchCurrenciesSuccess(currencies));
    const localExchange: string | null = localStorage.getItem('exchange');
    const ex = localExchange && localExchange !== 'undefined' ? JSON.parse(localExchange) : currencies[0];
    setExchange(ex)(dispatch, getState);
    return;
  } catch (error) {
    dispatch(FETCH_CURRENCIES_FAILURE);
    throw error;
  }
};

export { fetchCurrencies, setExchange };
