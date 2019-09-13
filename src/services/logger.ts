const isProd = process.env.NODE_ENV === 'production';

const logError = (url: string, body: any) => {
  if (isProd) return;
  console.error(`FUCK! ${url} => ${body}`);
}

const logSuccess = (url: string, body: any) => {
  if (isProd) return;
  console.log(`SUCCESS! ${url} => ${body}`);
}

const logInfo = (body: any) => {
  if (isProd) return;
  console.log(`INFO => ${body}`);
}

export {
  logError,
  logSuccess,
  logInfo,
};