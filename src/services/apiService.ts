const http: any = require('axios');
import api from '../api';
import { logError, logSuccess } from './logger';
import { mapCurrencies } from '../utils/formatCurrency';

if (process.env.REACT_APP_API_MODE === 'fake') {
  http.interceptors.response.use(
    (response: any) => {
      return new Promise(resolve => {
        setTimeout(() => resolve(response), 1500);
      });
    },
    (error: any) => {
      return Promise.reject(error);
    },
  );
}

export default class ApiService {

  _fetchData = async (method: string, url: string, params: any = '') => {
    try {
      const { data } = await http[method](url, params);
      logSuccess(url, data);
      return data;
    } catch(error) {
      logError(url, error);
      throw new Error(error);
    }
  }
  
  fetchCurrencies = async () => {
    try {
      const data = await this._fetchData('get', api.currencies);
      const formatedData = data.map(mapCurrencies);
      return formatedData;
    } catch(error) {
      throw error;
    }
  }
}