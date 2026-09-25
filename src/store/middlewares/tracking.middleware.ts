import { Middleware } from 'redux';
import { CustomAction, CustomActionType, ExchangesState } from '../types';
import { resolveExchange } from '../../utils/resolveExchange';

const capture = (event: string, payload?: any) => {
  window.posthog?.capture?.(event, payload);
};

const PAIR_ACTIONS: CustomActionType[] = ['SET_PAIR', 'SET_CURRENCY', 'SWAP_PAIR'];

export const trackingMiddleware: Middleware<{}, ExchangesState> =
  (store) => (next) => (action: CustomAction) => {
    const result = next(action);
    if (
      (['SET_THEME', 'SET_LANG', 'TOGGLE_EXCHANGE_METHOD', 'SET_METHOD'] as CustomActionType[]).includes(
        action.type,
      )
    ) {
      capture(action.type, action.payload);
    }
    if (PAIR_ACTIONS.includes(action.type)) {
      const { pair, currencies, market } = store.getState();
      const exchange = resolveExchange(pair, currencies, market);
      capture('SET_EXCHANGE', {
        codeFrom: pair.from,
        codeTo: pair.to,
        codes: `${pair.from}:${pair.to}`,
        source: exchange?.source,
        rateBuy: exchange?.rateBuy ?? exchange?.rateCross,
        rateSell: exchange?.rateSell ?? exchange?.rateCross,
        rateNB: exchange?.NB?.rate,
      });
    }
    return result;
  };
