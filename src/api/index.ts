import { logInfo } from '../services/logger';

const apiType: any = {
  prod: 'https://api.monobank.ua' as string,
  fake: 'http://localhost:3004' as string,
  dev: 'http://localhost:8080/api' as string,
};

const env: any = process.env.REACT_APP_API_MODE;

const ROOT_URL: string | undefined = apiType[env];

logInfo(`MODE: ${process.env.NODE_ENV}`);
logInfo(`ROOT URL ${process.env.REACT_APP_API_MODE}: ${ROOT_URL}`);

const api = {
  currencies: `${ROOT_URL}/monobank`,
  btc: `${ROOT_URL}/btc`,
  PBCurrencies: `${ROOT_URL}/privatbank`,
  NBCurrencies: `${ROOT_URL}/nationalbank`,
  lastUpdate: `${ROOT_URL}/date`,
};

export default api;
