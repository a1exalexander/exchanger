import { resolveExchange, hasBankRates } from '../utils/resolveExchange';
import { Currencies } from '../types';
import { MarketRates } from '../services/marketRates';

const bank = [
  {
    id: '840:980',
    currencyCodeA: 840,
    currencyCodeB: 980,
    rateBuy: 40,
    rateSell: 50,
    currencyA: { code: 'USD', currency: 'US Dollar' },
    currencyB: { code: 'UAH', currency: 'Hryvnia' },
    NB: { r030: 840, txt: 'Долар США', rate: 45, cc: 'USD', exchangedate: '' },
  },
  {
    id: '826:980',
    currencyCodeA: 826,
    currencyCodeB: 980,
    rateCross: 55,
    currencyA: { code: 'GBP', currency: 'Pound Sterling' },
    currencyB: { code: 'UAH', currency: 'Hryvnia' },
  },
] as Currencies;

const market: MarketRates = {
  date: '2026-09-25',
  rates: { USD: 1, UAH: 45, EUR: 0.9, BTC: 0.00001 },
  names: {},
  fetchedAt: 0,
};

describe('resolveExchange', () => {
  it('uses the Monobank pair as is', () => {
    const exchange = resolveExchange({ from: 'USD', to: 'UAH' }, bank, market);
    expect(exchange?.source).toBe('bank');
    expect(exchange?.rateSell).toBe(50);
  });

  it('reverses a Monobank pair and swaps buy / sell sides', () => {
    const exchange = resolveExchange({ from: 'UAH', to: 'USD' }, bank, market);
    expect(exchange?.source).toBe('bank');
    expect(exchange?.reversed).toBe(true);
    expect(exchange?.currencyA.code).toBe('UAH');
    // buying UAH = selling USD at the bank buy rate
    expect(exchange?.rateSell).toBeCloseTo(1 / 40);
    expect(exchange?.rateBuy).toBeCloseTo(1 / 50);
    expect(exchange?.NB?.rate).toBeCloseTo(1 / 45);
  });

  it('marks Monobank cross rates', () => {
    expect(resolveExchange({ from: 'GBP', to: 'UAH' }, bank, market)?.source).toBe(
      'bank-cross',
    );
  });

  it('falls back to the market rate for any other pair', () => {
    const exchange = resolveExchange({ from: 'EUR', to: 'BTC' }, bank, market);
    expect(exchange?.source).toBe('market');
    expect(Number(exchange?.rateCross)).toBeCloseTo(0.00001 / 0.9, 12);
  });

  it('returns nothing without data or for the same currency', () => {
    expect(resolveExchange({ from: 'EUR', to: 'BTC' }, bank, null)).toBeUndefined();
    expect(resolveExchange({ from: 'USD', to: 'USD' }, bank, market)).toBeUndefined();
  });

  it('knows which pairs have bank buy / sell rates', () => {
    expect(hasBankRates(bank, 'UAH', 'USD')).toBe(true);
    expect(hasBankRates(bank, 'GBP', 'UAH')).toBe(false);
  });
});
