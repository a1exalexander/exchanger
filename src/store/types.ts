import { SET_EXCHANGE, FETCH_CURRENCIES_SUCCESS } from '../constants';

type SN = string | number;

// STATE TYPES

export interface Currency {
  code: string;
  number: SN;
  digits: SN;
  currency: string;
  countries: Array<string>;
  country: string;
}

export interface Exchange {
  currencyCodeA: SN;
  currencyCodeB: SN;
  date: string;
  rateBuy?: SN;
  rateSell?: SN;
  rateCross?: SN;
  currencyA: Currency;
  currencyB: Currency;
}

export type Currencies = Array<Exchange>;

export interface ExchangesState {
  currencies: Currencies;
  loading: boolean;
  hasError: boolean;
  method: string;
  exchange: Exchange;
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

export type ActionTypes = SetExchangeAction | FetchCurrenciesSuccessAction | StringAction;