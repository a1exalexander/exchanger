import {
  SET_LAST_UPDATE,
  UPDATE_COMPUTED_PRICE,
  FETCH_CURRENCIES_REQUEST,
  FETCH_CURRENCIES_SUCCESS,
  FETCH_CURRENCIES_FAILURE,
  SET_EXCHANGE,
  TOGGLE_EXCHANGE_METHOD,
  UPDATE_COMPUTED_CURRENCY
} from "../../constants";
import initialExchange from "./initialExchange";
import initialCurrency from "./initialCurrency";
import { ExchangesState } from "../types";
import ReactGA from "react-ga";
import { Currency, SN } from "../../types";
const has: any = require("has");

const toggleExchangeMethod = (method: string) => {
  ReactGA.event({
    category: "Exchange Card",
    action: "Toggle rate method"
  });
  return method === "buy" ? "sell" : "buy";
};

const setExchangeMethod = (item: object) => {
  return has(item, "rateBuy") ? "buy" : "cross";
};

const updateComputedPrice = (state: Currency, payload: SN | null) => ({
  ...state,
  computedPrice: payload
});

const initialState: ExchangesState = {
  lastUpdate: localStorage.getItem("exchanger-updated-v2") || "",
  currencies: [...JSON.parse(localStorage.getItem('exchanger-currenices-v2') || '[]')],
  loading: false,
  hasError: false,
  method: setExchangeMethod(initialExchange),
  exchange: { ...initialExchange },
  computedCurrency: { ...initialCurrency }
};

const reducer = (
  state: ExchangesState = initialState,
  action: any
): ExchangesState => {
  switch (action.type) {
    case FETCH_CURRENCIES_REQUEST:
      return {
        ...state,
        loading: true,
        hasError: false
      };
    case FETCH_CURRENCIES_SUCCESS:
      return {
        ...state,
        currencies: [...action.payload],
        loading: false,
        hasError: false
      };
    case FETCH_CURRENCIES_FAILURE:
      return {
        ...state,
        loading: false,
        hasError: true
      };
    case SET_EXCHANGE:
      return {
        ...state,
        exchange: Object.assign({}, initialExchange, action.payload),
        method: setExchangeMethod(action.payload)
      };
    case TOGGLE_EXCHANGE_METHOD:
      return {
        ...state,
        method: toggleExchangeMethod(state.method)
      };
    case UPDATE_COMPUTED_PRICE:
      return {
        ...state,
        computedCurrency: updateComputedPrice(
          state.computedCurrency,
          action.payload
        )
      };
    case UPDATE_COMPUTED_CURRENCY:
      return {
        ...state,
        computedCurrency: { ...action.payload }
      };
    case SET_LAST_UPDATE:
      return {
        ...state,
        lastUpdate: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
