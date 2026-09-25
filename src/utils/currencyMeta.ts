import * as cc from 'currency-codes';
import flagMap from './flagMap.json';
import { Currencies } from '../types';
import { MarketRates } from '../services/marketRates';

const cryptocurrencies = require('cryptocurrencies');

export type CurrencyKind = 'fiat' | 'crypto' | 'metal';

export interface CurrencyOption {
  code: string;
  name: string;
  nameEn: string;
  kind: CurrencyKind;
  /** lower-cased text used for search */
  search: string;
}

export const POPULAR = [
  'UAH',
  'USD',
  'EUR',
  'PLN',
  'GBP',
  'CHF',
  'CZK',
  'CAD',
  'JPY',
  'CNY',
  'TRY',
  'BTC',
];

/** Default quick-pick chips, re-ordered later by how often each currency is used */
export const QUICK_PICK = ['UAH', 'USD', 'EUR', 'PLN', 'GBP', 'CHF', 'CZK', 'BTC'];
export const QUICK_PICK_SIZE = 8;

const CRYPTO = [
  'BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'SOL', 'XRP', 'TON', 'ADA', 'DOGE',
  'TRX', 'DOT', 'LTC', 'LINK', 'AVAX', 'XLM', 'XMR', 'BCH', 'ETC', 'ATOM',
  'NEAR', 'UNI', 'SHIB', 'PEPE', 'SUI', 'APT', 'ARB', 'OP', 'DAI', 'FIL',
  'ICP', 'HBAR', 'ALGO', 'XTZ', 'EOS', 'ZEC', 'DASH', 'PAXG', 'XAUT', 'POL',
];
const CRYPTO_SET = new Set(CRYPTO);

const METALS = ['XAU', 'XAG', 'XPT', 'XPD'];
const METAL_SET = new Set(METALS);

/** Unofficial codes with real use that are missing in ISO 4217 */
const EXTRA_FIAT = ['CNH', 'GGP', 'IMP', 'JEP'];
/** ISO technical / fund codes nobody converts */
const SKIP = new Set([
  'XXX', 'XTS', 'XSU', 'XUA', 'XBA', 'XBB', 'XBC', 'XBD', 'BOV', 'CHE',
  'CHW', 'CLF', 'COU', 'MXV', 'USN', 'UYI', 'UYW',
]);

const ISO_CODES = new Set<string>(cc.codes());

const makeDisplayNames = (type: 'currency' | 'region') => {
  try {
    return new Intl.DisplayNames(['uk'], { type });
  } catch {
    return null;
  }
};
const currencyNamesUk = makeDisplayNames('currency');
const regionNamesUk = makeDisplayNames('region');

/** Names that browsers don't translate (or translate inconsistently) */
const UK_NAMES: { [code: string]: string } = {
  UAH: 'Українська гривня',
  XAU: 'Золото (тройська унція)',
  XAG: 'Срібло (тройська унція)',
  XPT: 'Платина (тройська унція)',
  XPD: 'Паладій (тройська унція)',
  XDR: 'Спеціальні права запозичення',
  BTC: 'Біткоїн',
  ETH: 'Ефіріум',
  USDT: 'Tether',
  USDC: 'USD Coin',
  TON: 'Toncoin',
};

const capitalize = (text: string) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : text;

export const getKind = (code: string): CurrencyKind => {
  if (METAL_SET.has(code)) return 'metal';
  if (CRYPTO_SET.has(code) || !ISO_CODES.has(code)) {
    return EXTRA_FIAT.includes(code) ? 'fiat' : 'crypto';
  }
  return 'fiat';
};

export const isFiatLike = (code: string) => getKind(code) !== 'crypto';

const englishName = (code: string, market?: MarketRates | null) =>
  market?.names?.[code] ||
  cc.code(code)?.currency ||
  cryptocurrencies[code] ||
  '';

export const getCurrencyName = (code: string, market?: MarketRates | null) => {
  if (!code) return '';
  if (UK_NAMES[code]) return UK_NAMES[code];
  if (getKind(code) !== 'crypto' && currencyNamesUk) {
    const name = currencyNamesUk.of(code);
    if (name && name !== code) return capitalize(name);
  }
  return englishName(code, market) || code;
};

const regionName = (code: string) => {
  if (!regionNamesUk || code.startsWith('X') || getKind(code) !== 'fiat') {
    return '';
  }
  try {
    const name = regionNamesUk.of(code.slice(0, 2));
    return name && name !== code.slice(0, 2) ? name : '';
  } catch {
    return '';
  }
};

const METAL_SEARCH: { [code: string]: string } = {
  XAU: 'gold метал',
  XAG: 'silver метал',
  XPT: 'platinum метал',
  XPD: 'palladium метал',
};

const flagIcons: { [code: string]: string } = flagMap;

const requireFlag = (name: string) => {
  try {
    return require(`../assets/flags/${name}.svg`) || '';
  } catch {
    return '';
  }
};

const requireCryptoIcon = (code: string) => {
  try {
    return require(`cryptocurrency-icons/svg/color/${code.toLowerCase()}.svg`) || '';
  } catch {
    return '';
  }
};

const iconCache: { [code: string]: string } = {};

/** URL of a flag / coin icon or an empty string */
export const getCurrencyIcon = (code: string): string => {
  if (!code) return '';
  if (!(code in iconCache)) {
    iconCache[code] =
      getKind(code) !== 'crypto' && flagIcons[code]
        ? requireFlag(flagIcons[code])
        : requireCryptoIcon(code);
  }
  return iconCache[code];
};

const buildOption = (
  code: string,
  market?: MarketRates | null,
): CurrencyOption => {
  const name = getCurrencyName(code, market);
  const nameEn = englishName(code, market);
  const countries = (cc.code(code)?.countries || []).join(' ');
  return {
    code,
    name,
    nameEn,
    kind: getKind(code),
    search: [code, name, nameEn, regionName(code), countries, METAL_SEARCH[code]]
      .join(' ')
      .toLowerCase(),
  };
};

/**
 * Every currency the app can convert: bank pairs from the backend plus
 * everything available from the market rates provider.
 */
export const buildCurrencyOptions = (
  bank: Currencies,
  market: MarketRates | null,
): CurrencyOption[] => {
  const codes = new Set<string>(['UAH']);
  bank.forEach(({ currencyA, currencyB }) => {
    if (currencyA?.code) codes.add(currencyA.code);
    if (currencyB?.code) codes.add(currencyB.code);
  });
  if (market) {
    Object.keys(market.rates).forEach((code) => {
      const kind = getKind(code);
      if (SKIP.has(code)) return;
      if (kind === 'crypto' && !CRYPTO_SET.has(code)) return;
      codes.add(code);
    });
  }
  return Array.from(codes)
    .map((code) => buildOption(code, market))
    .sort((a, b) => a.name.localeCompare(b.name, 'uk'));
};

const rank = (option: CurrencyOption, query: string) => {
  const code = option.code.toLowerCase();
  const name = option.name.toLowerCase();
  if (code === query) return 0;
  if (code.startsWith(query)) return 1;
  if (name.startsWith(query)) return 2;
  if (name.split(/\s+/).some((word) => word.startsWith(query))) return 3;
  return 4;
};

export const searchCurrencies = (options: CurrencyOption[], raw: string) => {
  const query = raw.trim().toLowerCase();
  if (!query) return options;
  return options
    .filter((option) => option.search.includes(query))
    .map((option) => ({ option, score: rank(option, query) }))
    .sort((a, b) => a.score - b.score)
    .map(({ option }) => option);
};

const RECENT_KEY = 'exchanger-recent-currencies';

export const getRecent = (): string[] => {
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(value) ? value.slice(0, 6) : [];
  } catch {
    return [];
  }
};

export const pushRecent = (code: string) => {
  try {
    const next = [code, ...getRecent().filter((item) => item !== code)];
    localStorage.setItem(RECENT_KEY, JSON.stringify(next.slice(0, 6)));
  } catch {
    // storage may be unavailable (private mode)
  }
};

const USAGE_KEY = 'exchanger-currency-usage';
export const USAGE_EVENT = 'exchanger:currency-usage';

export const getUsage = (): { [code: string]: number } => {
  try {
    const value = JSON.parse(localStorage.getItem(USAGE_KEY) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
};

/** Count every time a currency is chosen, so quick pick can surface favourites */
export const trackUsage = (code: string) => {
  try {
    const usage = getUsage();
    usage[code] = (usage[code] || 0) + 1;
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
    window.dispatchEvent(new CustomEvent(USAGE_EVENT, { detail: code }));
  } catch {
    // storage may be unavailable (private mode)
  }
};

/** Most used currencies first; defaults keep their order among equals */
export const rankQuickPick = (available: Set<string>) => {
  const usage = getUsage();
  const candidates = Array.from(new Set([...QUICK_PICK, ...Object.keys(usage)])).filter(
    (code) => available.has(code),
  );
  const defaultIndex = (code: string) => {
    const index = QUICK_PICK.indexOf(code);
    return index === -1 ? QUICK_PICK.length : index;
  };
  return candidates
    .sort(
      (a, b) =>
        (usage[b] || 0) - (usage[a] || 0) || defaultIndex(a) - defaultIndex(b),
    )
    .slice(0, QUICK_PICK_SIZE);
};
