import {
  FETCH_CURRENCIES_REQUEST,
  FETCH_CURRENCIES_SUCCESS,
  FETCH_CURRENCIES_FAILURE,
  SET_EXCHANGE
} from '../../constants';
import { ActionTypes, Exchange, Currencies, ExchangesState } from '../types';
import ApiService from '../../services/apiService';
const apiService = new ApiService();

const fetchCurrenciesSuccess = (payload: Currencies) => {
  return {
    type: FETCH_CURRENCIES_SUCCESS,
    payload
  };
};

const setExchange = (payload: string | Exchange) => (dispatch: any, getState: any) => {
  let exchange;
  if (typeof payload === 'string') {
    exchange = getState().currencies.find((item: Exchange) => item.currencyA.code === payload);
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
    const currencies = await apiService.fetchCurrencies();
    dispatch(fetchCurrenciesSuccess(currencies));
    const localExchange: string | null = localStorage.getItem('exchange');
    const ex = localExchange ? JSON.parse(localExchange) : currencies[0];
    setExchange(ex)(dispatch, getState);
    return;
  } catch (error) {
    dispatch(FETCH_CURRENCIES_FAILURE);
    throw error;
  }
};

export { fetchCurrencies, setExchange };
