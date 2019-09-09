import {
  FETCH_CURRENCIES_REQUEST,
  FETCH_CURRENCIES_SUCCESS,
  FETCH_CURRENCIES_FAILURE,
  SET_EXCHANGE
} from '../../constants';
import ApiService from '../../services/apiService';
const apiService = new ApiService();

const fetchCurrenciesSuccess = payload => {
  return {
    type: FETCH_CURRENCIES_SUCCESS,
    payload
  };
};

const setExchange = (payload) => (dispatch, getState) => {
  let exchange;
  if (typeof payload === 'string') {
    exchange = getState().currencies.find(item => item.currencyA.code === payload);
  } else {
    exchange = payload;
  }
  localStorage.setItem('exchange', JSON.stringify(exchange));
  dispatch({
    type: SET_EXCHANGE,
    payload: exchange,
  });
};

const fetchCurrencies = () => async (dispatch, getState) => {
  dispatch(FETCH_CURRENCIES_REQUEST);
  try {
    const currencies = await apiService.fetchCurrencies();
    dispatch(fetchCurrenciesSuccess(currencies));
    const ex = localStorage.getItem('exchange') ? JSON.parse(localStorage.getItem('exchange')) : currencies[0];
    setExchange(ex)(dispatch, getState);
    return;
  } catch (error) {
    dispatch(FETCH_CURRENCIES_FAILURE);
    throw error;
  }
};

export { fetchCurrencies, setExchange };
