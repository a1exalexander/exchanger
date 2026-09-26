import axios from 'axios';
import { logError } from './logger';

/**
 * Free, key-less exchange rates for ~160 fiat currencies, metals and crypto.
 * https://github.com/fawazahmed0/exchange-api (updated daily, CORS enabled).
 * Two mirrors of the same dataset are tried in order.
 */
const MIRRORS = [
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1',
  'https://latest.currency-api.pages.dev/v1',
];

export interface MarketRates {
  /** Date of the rates, YYYY-MM-DD */
  date: string;
  /** Units of currency per 1 USD, keys are upper-case codes */
  rates: { [code: string]: number };
  /** English names, keys are upper-case codes */
  names: { [code: string]: string };
  /** When the data was fetched (ms) */
  fetchedAt: number;
}

const upperKeys = <T>(obj: { [key: string]: T }) =>
  Object.keys(obj).reduce((acc, key) => {
    acc[key.toUpperCase()] = obj[key];
    return acc;
  }, {} as { [key: string]: T });

const getFromMirrors = async <T>(path: string): Promise<T> => {
  let lastError: unknown;
  for (const root of MIRRORS) {
    try {
      const { data } = await axios.get<T>(`${root}/${path}`, { timeout: 8000 });
      return data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

export const fetchMarketRates = async (): Promise<MarketRates | null> => {
  try {
    const [usd, names] = await Promise.all([
      getFromMirrors<{ date: string; usd: { [code: string]: number } }>(
        'currencies/usd.min.json',
      ),
      getFromMirrors<{ [code: string]: string }>('currencies.min.json').catch(
        () => ({}),
      ),
    ]);
    return {
      date: usd.date,
      rates: upperKeys(usd.usd),
      names: upperKeys(names),
      fetchedAt: Date.now(),
    };
  } catch (error) {
    logError('market rates', error);
    return null;
  }
};

/** Rates are published once a day, refetch at most every 3 hours */
export const isMarketStale = (market: MarketRates | null) =>
  !market || Date.now() - (market.fetchedAt || 0) > 3 * 60 * 60 * 1000;
