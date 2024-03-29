import { logInfo } from '../services/logger';

const apiType: { [key: string]: string } = {
  prod: 'https://whale-app-u5nay.ondigitalocean.app/api',
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
  currencies: `${ROOT_URL}/currencies`,
  lastUpdate: `${ROOT_URL}/date`,
};

export default api;
