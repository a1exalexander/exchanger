const stringMiddleware = () => (next: any) => (action: any) => {
  const isString = typeof action === 'string';
  if (isString) {
    return next({
      type: action,
    });
  } 
  return next(action);
};

export default stringMiddleware;