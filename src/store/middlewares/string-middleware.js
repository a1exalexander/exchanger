const stringMiddleware = () => (next) => (action) => {
  const isString = typeof action === 'string';
  if (isString) {
    return next({
      type: action,
    });
  } 
  return next(action);
};

export default stringMiddleware;