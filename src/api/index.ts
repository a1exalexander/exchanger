import { logInfo } from '../services/logger';

const apiType: { [key: string]: string } = {
  prod: 'https://exchanger-uah.herokuapp.com/api',
  fake: 'http://localhost:3004',
  dev: 'http://localhost:8080/api',
};

type API_MODE_TYPE = 'prod' | 'fake' | 'dev';
const env: API_MODE_TYPE =
  (process.env.REACT_APP_API_MODE as API_MODE_TYPE) || 'dev';

const ROOT_URL: string = apiType[env];

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
