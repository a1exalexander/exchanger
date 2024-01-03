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
    if (action.type === 'SET_EXCHANGE') {
      window.posthog.capture(action.type, {
        ...action.payload,
        codes: `${action.payload?.currencyA?.code}:${action.payload?.currencyB?.code}`,
      });
    }
    return next(action);
  };
