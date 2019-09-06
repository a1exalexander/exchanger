import { FETCH_CURRENCIES_REQUEST, FETCH_CURRENCIES_SUCCESS, FETCH_CURRENCIES_FAILURE } from '../../constants';
import ApiService from '../../services/apiService';
const apiService = new ApiService();

const fetchCurrenciesSuccess = (currencies) => {
  return {
    type: FETCH_CURRENCIES_SUCCESS,
    payload: currencies,
  }
};

const fetchCurrencies = () => async (dispatch) => {
  dispatch(FETCH_CURRENCIES_REQUEST);
  try {
    const currencies = await apiService.fetchCurrencies();
    dispatch(fetchCurrenciesSuccess(currencies));
  } catch(error) {
    dispatch(FETCH_CURRENCIES_FAILURE);
  }
};

export { fetchCurrencies };