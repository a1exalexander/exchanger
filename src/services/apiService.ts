import api from '../api';
import { logError, logSuccess } from './logger';
import {
  mapCurrencies,
  filterCurrencies,
  mapBTC,
} from '../utils/formatCurrency';
import { isArray } from 'lodash';
import { monoStorage, nbStorage, pbStorage, btcStorage } from './storage';
const http: any = require('axios');

http.interceptors.response.use(
  (response: any) => {
    logSuccess(response.config.url, response.data);
    return Promise.resolve(response);
  },
  (error: any) => {
    logError(error.response.config.url || 'FUCK', error);
    return Promise.reject(error);
  }
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
      if (isArray(data) && data.length) {
        const formatedData = data.map(mapCurrencies).filter(filterCurrencies);
        monoStorage.set(formatedData);
        return formatedData;
      }
      return monoStorage.get() || [];
    } catch (error) {
      return monoStorage.get() || [];
    }
  };

  fetchBTC = async () => {
    try {
      const { data } = await http.get(api.btc);
      if (isArray(data) && data.length) {
        const formatedData = data.map(mapBTC);
        btcStorage.set(formatedData);
        return formatedData;
      }
      return btcStorage.get() || [];
    } catch (error) {
      return btcStorage.get() || [];
    }
  };

  fetchPBCurrencies = async () => {
    try {
      const { data: { exchangeRate = [] } = {} } =
        (await http.get(api.PBCurrencies)) || {};
      if (isArray(exchangeRate) && exchangeRate.length) {
        pbStorage.set(exchangeRate);
        return exchangeRate;
      }
      return pbStorage.get() || [];
    } catch (error) {
      return pbStorage.get() || [];
    }
  };

  fetchNBCurrencies = async () => {
    try {
      const { data } = await http.get(api.NBCurrencies);
      if (isArray(data) && data.length) {
        nbStorage.set(data);
        return data;
      }
      return nbStorage.get() || [];
    } catch (error) {
      return nbStorage.get() || [];
    }
  };

  fetchLastUpdate = async () => {
    try {
      const { data } = await http.get(api.lastUpdate);
      return data;
    } catch {
      return '';
    }
  };
}
