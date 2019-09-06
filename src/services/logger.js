const isProd = process.env.NODE_ENV === 'production';

const logError = (url, body) => {
  if (isProd) return;
  console.error(`FUCK! ${url} => ${body}`);
}

const logSuccess = (url, body) => {
  if (isProd) return;
  console.log(`SUCCESS! ${url} => ${body}`);
}

const logInfo = (body) => {
  if (isProd) return;
  console.log(`INFO => ${body}`);
}

export {
  logError,
  logSuccess,
  logInfo,
};