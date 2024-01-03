import { SET_EXCHANGE, FETCH_CURRENCIES_SUCCESS } from '../constants';
import { Exchange, Currencies, Currency } from '../types';
import { Action } from 'redux';
import * as actionsTypes from '../constants';

export type CustomActionType = keyof typeof actionsTypes;

export type CustomAction<T = undefined> = Action<CustomActionType> & {
  payload?: T | Exchange;
};

export type SN = string | number;

// STATE TYPES

export interface ExchangesState {
  lastUpdate: string;
  currencies: Currencies;
  loading: boolean;
  hasError: boolean;
  method: 'sell' | 'buy' | 'cross';
  exchange: Exchange;
  computedCurrency: Currency;
  theme: 'light' | 'dark';
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
export type ActionTypes =
  | SetExchangeAction
  | FetchCurrenciesSuccessAction
  | StringAction
  | void;
