import api from '../api';
import { logError, logSuccess } from './logger';
import { currenciesStorage } from './storage';
import { Exchange } from '../types';
import axios from 'axios';

axios.interceptors.response.use(
  (response: any) => {
    logSuccess(response.config.url, response.data);
    return Promise.resolve(response);
  },
  (error: any) => {
    logError(error.response.config.url || 'FUCK', error);
    return Promise.reject(error);
  }
);

export default class ApiService {
  fetchCurrencies = async () => {
    try {
      const { data }: { data: Exchange[] } = await axios.get(api.currencies);
      return data;
    } catch {
      return (currenciesStorage.get() || []) as Exchange[];
    }
  };

  fetchLastUpdate = async () => {
    try {
      const { data } = await axios.get(api.lastUpdate);
      return data;
    } catch {
      return '';
    }
  };
}
