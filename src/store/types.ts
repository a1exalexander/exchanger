import { SET_EXCHANGE, FETCH_CURRENCIES_SUCCESS } from '../constants';
import { Exchange, Currencies, Currency } from '../types';

export type SN = string | number;

// STATE TYPES

export interface ExchangesState {
  lastUpdate: string;
  currencies: Currencies;
  loading: boolean;
  hasError: boolean;
  method: string;
  exchange: Exchange;
  computedCurrency: Currency;
}

// ACTIONS TYPES

interface SetExchangeAction {
  type: typeof SET_EXCHANGE;
  payload: Exchange;
}

interface FetchCurrenciesSuccessAction {
  type: typeof FETCH_CURRENCIES_SUCCESS;
  payload: Currencies;
}

type StringAction = string;
export type ActionTypes = SetExchangeAction | FetchCurrenciesSuccessAction | StringAction | void;