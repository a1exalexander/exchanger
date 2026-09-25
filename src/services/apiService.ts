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
  /** Monobank + NBU rates and the moment they were fetched (ISO) */
  fetchCurrencies = async (): Promise<{ date: string; currencies: Exchange[] }> => {
    try {
      const { data } = await axios.get(api.currencies);
      return data;
    } catch {
      return { date: '', currencies: (currenciesStorage.get() || []) as Exchange[] };
    }
  };
}
