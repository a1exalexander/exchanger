import { Currencies } from '../types';
import { MarketRates } from '../services/marketRates';
import { Pair } from '../utils/resolveExchange';
import { Action } from 'redux';
import * as actionsTypes from '../constants';

export type CustomActionType = keyof typeof actionsTypes;

export type CustomAction<T = any> = Action<CustomActionType> & {
  payload?: T;
};

export type SN = string | number;

export type ExchangeMethod = 'sell' | 'buy' | 'cross';

// STATE TYPES

export interface ExchangesState {
  lastUpdate: string;
  currencies: Currencies;
  market: MarketRates | null;
  loading: boolean;
  hasError: boolean;
  method: ExchangeMethod;
  pair: Pair;
  theme: 'light' | 'dark';
}
