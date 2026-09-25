import Big from 'big.js';
import { Currencies, Exchange, ExchangeSource, SN } from '../types';
import { MarketRates } from '../services/marketRates';

export interface Pair {
  from: string;
  to: string;
}

const invert = (value?: SN) => {
  if (value === undefined || value === '' || !Number(value)) return undefined;
  return Number(new Big(1).div(value).toPrecision(10));
};

const findBankPair = (bank: Currencies, a: string, b: string) =>
  bank.find(
    ({ currencyA, currencyB }) =>
      currencyA?.code === a && currencyB?.code === b,
  );

/**
 * Bank rates are quoted as "1 A = rate B". When the user wants the pair the
 * other way round, the buy/sell sides swap: the bank sells B for A at 1/rateBuy
 * and buys B at 1/rateSell.
 */
const reverseExchange = (exchange: Exchange): Exchange => ({
  ...exchange,
  id: `${exchange.id}:reversed`,
  currencyCodeA: exchange.currencyCodeB,
  currencyCodeB: exchange.currencyCodeA,
  currencyA: exchange.currencyB,
  currencyB: exchange.currencyA,
  rateBuy: invert(exchange.rateSell),
  rateSell: invert(exchange.rateBuy),
  rateCross: invert(exchange.rateCross),
  NB: exchange.NB
    ? { ...exchange.NB, rate: invert(exchange.NB.rate) as number }
    : undefined,
  grow: exchange.grow ? -Number(exchange.grow) : exchange.grow,
  reversed: true,
});

const marketExchange = (
  { from, to }: Pair,
  market: MarketRates,
): Exchange | undefined => {
  const rateFrom = market.rates[from];
  const rateTo = market.rates[to];
  if (!rateFrom || !rateTo) return undefined;
  return {
    id: `market:${from}:${to}`,
    currencyCodeA: from,
    currencyCodeB: to,
    currencyA: { code: from, currency: from },
    currencyB: { code: to, currency: to },
    rateCross: Number(new Big(rateTo).div(rateFrom).toPrecision(10)),
    precision: 8,
    date: market.date,
    source: 'market',
  };
};

const sourceOf = (exchange: Exchange): ExchangeSource =>
  exchange.rateBuy ? 'bank' : exchange.NB ? 'nbu' : 'bank-cross';

/**
 * Find the best available rate for any two currencies:
 * 1. Monobank pair (buy / sell or cross rate, NBU rate when available)
 * 2. The same Monobank pair reversed
 * 3. Market rate from the free rates provider
 */
export const resolveExchange = (
  pair: Pair,
  bank: Currencies,
  market: MarketRates | null,
): Exchange | undefined => {
  const { from, to } = pair;
  if (!from || !to || from === to) return undefined;

  const direct = findBankPair(bank, from, to);
  if (direct) return { ...direct, source: sourceOf(direct) };

  const opposite = findBankPair(bank, to, from);
  if (opposite) {
    const reversed = reverseExchange(opposite);
    return { ...reversed, source: sourceOf(reversed) };
  }

  return market ? marketExchange(pair, market) : undefined;
};

/** Does Monobank quote buy / sell rates for this pair (in any direction)? */
export const hasBankRates = (bank: Currencies, a: string, b: string) => {
  const exchange = findBankPair(bank, a, b) || findBankPair(bank, b, a);
  return !!exchange?.rateBuy;
};
