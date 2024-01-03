import { Dispatch } from 'redux';
import { CustomAction, CustomActionType } from '../types';

export const trackingMiddleware =
  () => (next: Dispatch<CustomAction>) => (action: CustomAction) => {
    if (
      (
        [
          'SET_EXCHANGE',
          'SET_THEME',
          'TOGGLE_EXCHANGE_METHOD',
          'UPDATE_COMPUTED_CURRENCY',
          'UPDATE_COMPUTED_PRICE',
        ] as CustomActionType[]
      ).includes(action.type)
    ) {
      window.posthog.capture(action.type, action.payload);
    }
    return next(action);
  };
