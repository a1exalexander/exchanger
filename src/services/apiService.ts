import api from '../api';
import { logError, logSuccess } from './logger';
import { mapCurrencies, filterCurrencies, mapBTC } from '../utils/formatCurrency';
import moment from 'moment';
const http: any = require('axios');

http.interceptors.response.use(
  (response: any) => {
    logSuccess(response.config.url, response.data);
    return Promise.resolve(response);
  },
  (error: any) => {
    logError(error.response.config.url || 'FUCK', error);
    return Promise.reject(error);
  },
);

// http.interceptors.request.use((config: any) => {
//   config.headers["Access-Control-Allow-Origin"] = "*";
//   return config;
// }, (error: Error) => {
//   return Promise.reject(error);
// });

export default class ApiService {
  
  fetchCurrencies = async () => {
    try {
      const { data } = await http.get(api.currencies);
      const formatedData = data.map(mapCurrencies).filter(filterCurrencies);
      return formatedData;
    } catch(error) {
      return [];
    }
  }

  fetchBTC = async () => {
    try {
      const { data } = await http.get(api.btc);
      const formatedData = data.map(mapBTC);
      return formatedData;
    } catch(error) {
      return [];
    }
  }

  fetchPBCurrencies = async () => {
    try {
      const { data: { exchangeRate = [] } = {} } = await http.get(api.PBCurrencies(moment().format('DD.MM.YYYY'))) || {};
      return exchangeRate;
    } catch(error) {
      return [];
    }
  }

  fetchNBCurrencies = async () => {
    try {
      const { data } = await http.get(api.NBCurrencies);
      return data;
    } catch(error) {
      return [];
    }
  } 
}