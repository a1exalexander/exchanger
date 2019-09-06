import { FETCH_CURRENCIES_REQUEST, FETCH_CURRENCIES_SUCCESS, FETCH_CURRENCIES_FAILURE } from '../../constants';

const initialState = {
  currencies: [],
  loading: false,
  hasError: false,
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
    default:
      return state;
  }
};

export default reducer;