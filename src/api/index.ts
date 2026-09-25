import { logInfo } from '../services/logger';

const apiType: { [key: string]: string } = {
  prod: '/api',
  fake: 'http://localhost:3004',
  // `vercel dev` serves the app and the `api/` functions on one port
  dev: 'http://localhost:3000/api',
};

type API_MODE_TYPE = 'prod' | 'fake' | 'dev';
const env: API_MODE_TYPE =
  (process.env.REACT_APP_API_MODE as API_MODE_TYPE) || 'dev';

const ROOT_URL: string = apiType[env];

logInfo(`MODE: ${process.env.NODE_ENV}`);
logInfo(`ROOT URL ${process.env.REACT_APP_API_MODE}: ${ROOT_URL}`);

const api = {
  currencies: `${ROOT_URL}/currencies`,
};

export default api;
