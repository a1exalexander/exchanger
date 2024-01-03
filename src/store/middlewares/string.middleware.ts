import { Middleware, Dispatch } from 'redux';
import { CustomAction } from '../types';

const stringMiddleware: Middleware =
  () => (next: Dispatch<CustomAction>) => (action: CustomAction) => {
    const isString = typeof action === 'string';
    if (isString) {
      return next({
        type: action,
      });
    }
    return next(action);
  };

export default stringMiddleware;
