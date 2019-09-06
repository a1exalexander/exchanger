const stringMiddleware = () => (next) => (action, payload) => {
  const isString = typeof action === 'string';
  if (isString && payload) {
    return next({
      type: action,
      payload,
    });
  } else if (isString) {
    return next({
      type: action,
    });
  }

  return next(action);
};

export default stringMiddleware;