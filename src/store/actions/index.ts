import {
  FETCH_CURRENCIES_REQUEST,
  FETCH_CURRENCIES_SUCCESS,
  FETCH_CURRENCIES_FAILURE,
  SET_LAST_UPDATE,
  SET_PAIR,
  SET_CURRENCY,
  SWAP_PAIR,
  SET_METHOD,
  SET_MARKET_RATES,
} from '../../constants';
import { Exchange, Currencies, SN } from '../../types';
import ApiService from '../../services/apiService';
import { fetchMarketRates, isMarketStale } from '../../services/marketRates';
import moment from 'moment';
import 'moment/locale/uk';
import { logError } from '../../services/logger';
import { currenciesStorage } from '../../services';
import { Dispatch } from 'redux';
import { ExchangeMethod, ExchangesState } from '../types';
import { pushRecent } from '../../utils/currencyMeta';

const apiService = new ApiService();

const fetchCurrenciesSuccess = (payload: Currencies) => {
  currenciesStorage.set(payload);
  return {
    type: FETCH_CURRENCIES_SUCCESS,
    payload,
  };
};

/** Select a Monobank pair by its id (used by the rates carousel) */
const setExchange =
  (id: SN) => (dispatch: Dispatch, getState: () => ExchangesState) => {
    const exchange = getState().currencies.find(
      (item: Exchange) => String(item.id) === String(id),
    );
    const from = exchange?.currencyA?.code;
    const to = exchange?.currencyB?.code;
    if (from && to) {
      dispatch({ type: SET_PAIR, payload: { from, to } });
    }
  };

const setCurrency = (side: 'from' | 'to', code: string) => {
  pushRecent(code);
  return { type: SET_CURRENCY, payload: { side, code } };
};

const swapPair = () => ({ type: SWAP_PAIR });

const setMethod = (method: ExchangeMethod) => ({
  type: SET_METHOD,
  payload: method,
});

export const setUpdatedDate = async (dispatch: Dispatch) => {
  const lastUpdate = await apiService.fetchLastUpdate();
  moment.locale('uk');
  const date = moment(lastUpdate);
  date.locale('uk');

  dispatch({
    type: SET_LAST_UPDATE,
    payload: lastUpdate ? date.format('DD MMMM, YYYY') : '',
  });
};

const loadMarketRates =
  () => async (dispatch: Dispatch, getState: () => ExchangesState) => {
    if (!isMarketStale(getState().market)) return;
    const market = await fetchMarketRates();
    if (market) dispatch({ type: SET_MARKET_RATES, payload: market });
  };

const fetchCurrencies =
  () => async (dispatch: Dispatch, getState: () => ExchangesState) => {
    dispatch({ type: FETCH_CURRENCIES_REQUEST });
    loadMarketRates()(dispatch, getState);
    try {
      const currencies = await apiService.fetchCurrencies();
      dispatch(fetchCurrenciesSuccess(currencies));
      setUpdatedDate(dispatch);
    } catch (error) {
      logError('fetchCurrencies', error);
      dispatch({ type: FETCH_CURRENCIES_FAILURE });
    }
  };

export {
  fetchCurrencies,
  loadMarketRates,
  setExchange,
  setCurrency,
  swapPair,
  setMethod,
};
