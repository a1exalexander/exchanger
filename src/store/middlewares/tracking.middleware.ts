import { Dispatch } from 'redux';
import { CustomAction, CustomActionType } from '../types';

export const trackingMiddleware =
  () => (next: Dispatch<CustomAction>) => (action: CustomAction) => {
    if (
      (
        [
          'SET_THEME',
          'TOGGLE_EXCHANGE_METHOD',
          'UPDATE_COMPUTED_CURRENCY',
          'UPDATE_COMPUTED_PRICE',
        ] as CustomActionType[]
      ).includes(action.type)
    ) {
      window.posthog.capture(action.type, action.payload);
    }
    if (action.type === 'SET_EXCHANGE' && action.payload) {
      window.posthog.capture(action.type, {
        codeFrom: action.payload?.currencyA?.code,
        codeTo: action.payload?.currencyB?.code,
        codes: `${action.payload?.currencyA?.code}:${action.payload?.currencyB?.code}`,
        rateBuy: action.payload?.rateBuy ?? action.payload?.rateCross,
        rateSell: action.payload?.rateSell ?? action.payload?.rateCross,
        rateNB: action.payload?.NB?.rate,
      });
    }
    return next(action);
  };
