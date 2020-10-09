import {
  FETCH_CURRENCIES_REQUEST,
  FETCH_CURRENCIES_SUCCESS,
  FETCH_CURRENCIES_FAILURE,
  SET_EXCHANGE,
  UPDATE_COMPUTED_PRICE,
  UPDATE_COMPUTED_CURRENCY,
  SET_LAST_UPDATE,
} from '../../constants';
import { ActionTypes } from '../types';
import { Exchange, Currencies, SN, Currency } from '../../types';
import ApiService from '../../services/apiService';
import ReactGA from 'react-ga';
import moment from 'moment';
import { toFix } from '../../utils/formatCurrency';
import { logError } from '../../services/logger';
import { currenciesStorage, exchangeStorage } from '../../services';
import { Dispatch } from 'redux';

const apiService = new ApiService();

const fetchCurrenciesSuccess = (payload: Currencies) => {
  currenciesStorage.set(payload);
  return {
    type: FETCH_CURRENCIES_SUCCESS,
    payload,
  };
};

const updateComputedPrice = (payload: SN | null) => (
  dispatch: any,
  getState: any
) => {
  const result =
    typeof payload === 'number'
      ? toFix(payload, getState().exchange.precision)
      : payload;
  dispatch({
    type: UPDATE_COMPUTED_PRICE,
    payload: result,
  });
};

const updateComputedCurrency = (payload: Currency) => (dispatch: any) => {
  dispatch({
    type: UPDATE_COMPUTED_CURRENCY,
    payload,
  });
};

const setExchange = (payload: SN | Exchange) => (
  dispatch: any,
  getState: any
) => {
  let exchange;
  if (typeof payload === 'string' || typeof payload === 'number') {
    exchange = getState().currencies.find(
      (item: Exchange) => String(item.id) === String(payload)
    );
  } else {
    exchange = payload;
  }
  exchangeStorage.set(exchange);
  ReactGA.event({
    category: 'Currencies',
    action: 'Select currencies',
  });
  ReactGA.set({
    currencyA: `${exchange.currencyA.code || exchange}`,
    currencyB: `${exchange.currencyB.code || exchange}`,
  });
  dispatch({
    type: SET_EXCHANGE,
    payload: exchange,
  } as ActionTypes);
};

export const setUpdatedDate = async (dispatch: Dispatch) => {
  const lastUpdate = await apiService.fetchLastUpdate();
  dispatch({
    type: SET_LAST_UPDATE,
    payload: lastUpdate ? moment(lastUpdate).format('DD MMMM, YYYY') : '',
  });
};

const fetchCurrencies = () => async (dispatch: Dispatch, getState: any) => {
  dispatch({ type: FETCH_CURRENCIES_REQUEST });
  try {
    const currencies = await apiService.fetchCurrencies();
    const localExchange: Exchange | null = exchangeStorage.get();
    const ex = localExchange ? localExchange : currencies[0];
    setExchange(ex)(dispatch, getState);
    dispatch(fetchCurrenciesSuccess(currencies));
    setUpdatedDate(dispatch);
  } catch (error) {
    logError('fetchCurrencies', error);
    dispatch({ type: FETCH_CURRENCIES_FAILURE });
  }
};

export {
  fetchCurrencies,
  setExchange,
  updateComputedPrice,
  updateComputedCurrency,
};
