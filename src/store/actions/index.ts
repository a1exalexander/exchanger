import {
  FETCH_CURRENCIES_REQUEST,
  FETCH_CURRENCIES_SUCCESS,
  FETCH_CURRENCIES_FAILURE,
  SET_EXCHANGE,
  UPDATE_COMPUTED_PRICE,
  UPDATE_COMPUTED_CURRENCY,
  SET_LAST_UPDATE
} from '../../constants';
import { ActionTypes } from '../types';
import { Exchange, Currencies, SN, Currency } from '../../types';
import ApiService from '../../services/apiService';
import { getUahBtc, getSyncCash } from '../../utils/formatCurrency';
import ReactGA from 'react-ga';
import { toFix } from '../../utils/formatCurrency';
import moment from 'moment';

const apiService = new ApiService();

const fetchCurrenciesSuccess = (payload: Currencies) => {
  localStorage.setItem('exchanger-currenices', JSON.stringify(payload));
  return {
    type: FETCH_CURRENCIES_SUCCESS,
    payload
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
    payload: result
  });
};

const updateComputedCurrency = (payload: Currency) => (
  dispatch: any
) => {
  dispatch({
    type: UPDATE_COMPUTED_CURRENCY,
    payload
  });
};

const setExchange = (payload: SN | Exchange) => (
  dispatch: any,
  getState: any,
) => {
  let exchange;
  if (typeof payload === 'string' || typeof payload === 'number') {
    exchange = getState().currencies.find(
      (item: Exchange) => String(item.id) === String(payload)
    );
  } else {
    exchange = payload;
  }
  localStorage.setItem('exchange', JSON.stringify(exchange));
  ReactGA.event({
    category: 'Currencies',
    action: 'Select currencies'
  });
  ReactGA.set({
    currencyA: `${exchange.currencyA.code || exchange}`,
    currencyB: `${exchange.currencyB.code || exchange}`
  });
  dispatch({
    type: SET_EXCHANGE,
    payload: exchange
  } as ActionTypes);
};

export const setUpdatedDate = () => {
  const date = moment().format('DD.MM.YYYY');
  localStorage.setItem('exchanger-updated', date);
  return { type: SET_LAST_UPDATE, payload: date };
}

const fetchCurrencies = () => async (dispatch: any, getState: any) => {
  dispatch(FETCH_CURRENCIES_REQUEST);
  try {
    const cash = await apiService.fetchCurrencies();
    const crypto = await apiService.fetchBTC();
    const NBCurrencies = await apiService.fetchNBCurrencies();
    const uahBtc = getUahBtc(cash, crypto);
    const syncCash = getSyncCash(cash, NBCurrencies);
    const currencies = [...syncCash, ...crypto, uahBtc];
    const localExchange: string | null = localStorage.getItem('exchange');
    const ex =
      localExchange && localExchange !== 'undefined'
        ? JSON.parse(localExchange)
        : currencies[0];
    setExchange(ex)(dispatch, getState);
    dispatch(fetchCurrenciesSuccess(currencies));
    dispatch(setUpdatedDate());
  } catch (error) {
    dispatch(FETCH_CURRENCIES_FAILURE);
  }
};

export { fetchCurrencies, setExchange, updateComputedPrice, updateComputedCurrency };
