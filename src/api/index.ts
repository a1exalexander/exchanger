import { logInfo } from '../services/logger';

const apiType: any = {
  prod: 'https://api.monobank.ua' as string,
  fake: 'http://localhost:3004' as string,
};

const env: any = process.env.REACT_APP_API_MODE;

const ROOT_URL: string | undefined = apiType[env];

logInfo(`MODE: ${process.env.NODE_ENV}`);
logInfo(`ROOT URL ${process.env.REACT_APP_API_MODE}: ${ROOT_URL}`);

const api = {
  currencies: `${ROOT_URL}/bank/currency`,
  btc: `https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=1`,
}

export default api;

