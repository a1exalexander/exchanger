import { useSelector } from 'react-redux';
import { ExchangesState } from '../store/types';

export type Lang = 'uk' | 'en';

export const LANGS: Lang[] = ['uk', 'en'];

/** Ukrainian when the browser asks for it (or is set up for Ukraine), English otherwise */
export const detectLang = (): Lang => {
  if (typeof navigator === 'undefined') return 'uk';
  const preferred = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  const isUkrainian = preferred.some((tag) => /^uk\b|-ua$/i.test(tag || ''));
  return isUkrainian ? 'uk' : 'en';
};

const uk = {
  meta: {
    title: 'Exchanger — конвертер валют',
    description:
      'Конвертер валют: гривня UAH, USD, EUR, PLN, GBP, CHF та понад 200 валют і криптовалют за курсом Monobank, НБУ та ринковим курсом',
  },
  header: {
    home: 'Exchanger — на головну',
    language: 'Мова',
  },
  theme: {
    label: 'Темна тема',
    toLight: 'Світла тема',
    toDark: 'Темна тема',
  },
  footer: {
    sources: 'Джерела курсів',
    monoNote: 'купівля та продаж',
    nbuNote: 'офіційний курс',
    marketNote: 'середньоринковий, для інших валют',
    disclaimer: 'Середньоринкові курси довідкові й оновлюються щодня.',
    updated: 'Оновлено:',
  },
  providers: {
    monoDescription: 'Курс купівлі та продажу Monobank',
    nbuName: 'НБУ',
    nbuDescription: 'Офіційний курс Національного банку України',
    marketName: 'Середньоринковий',
    marketDescription:
      'Середньоринковий курс з відкритого API exchange-api (зведені дані кількох відкритих джерел, оновлюється щодня). Довідковий, не курс банку',
  },
  card: {
    label: 'Конвертер валют',
    amountIn: (code: string) => `Сума в ${code}`,
    swap: 'Поміняти валюти місцями',
    operation: 'Операція',
    buy: 'Купую',
    sell: 'Продаю',
    unavailable: 'Курс для цієї пари зараз недоступний',
    bankCross: 'Monobank, крос-курс',
    official: 'офіційний курс',
    market: 'Середньоринковий',
    rateDate: 'Дата курсу',
    nbuRate: 'Офіційний курс НБУ',
  },
  select: {
    from: 'Яку валюту конвертуємо?',
    to: 'У яку валюту конвертуємо?',
    current: 'Зараз',
  },
  picker: {
    recent: 'Нещодавні',
    popular: 'Популярні',
    all: 'Усі валюти',
    crypto: 'Криптовалюти',
    metals: 'Дорогоцінні метали',
    close: 'Закрити',
    placeholder: 'Код, назва або країна',
    search: 'Пошук валюти',
    clear: 'Очистити пошук',
    empty: (query: string) => `Нічого не знайдено за запитом «${query}»`,
    results: 'Результати пошуку',
    bankTag: 'Курс купівлі та продажу від Monobank',
    swapTag: 'обмін',
    swapTagTitle: 'Валюти поміняються місцями',
  },
  quickPick: {
    title: 'Швидкий вибір',
    hint: (count: number) =>
      `Тут першими з'являються валюти, які ти обираєш найчастіше. Усі ${count} — за натисканням на валюту в картці.`,
  },
  slide: {
    sell: 'Продаж:',
    buy: 'Купівля:',
    cross: 'Перехресний курс:',
    open: (from: string, to: string) => `Відкрити ${from} → ${to} у конвертері`,
  },
};

export type Messages = typeof uk;

const en: Messages = {
  meta: {
    title: 'Exchanger — currency converter',
    description:
      'Currency converter: Ukrainian hryvnia UAH, USD, EUR, PLN, GBP, CHF and 200+ currencies and cryptocurrencies at Monobank, National Bank of Ukraine and mid-market rates',
  },
  header: {
    home: 'Exchanger — home',
    language: 'Language',
  },
  theme: {
    label: 'Dark theme',
    toLight: 'Light theme',
    toDark: 'Dark theme',
  },
  footer: {
    sources: 'Rate sources',
    monoNote: 'buy and sell',
    nbuNote: 'official rate',
    marketNote: 'mid-market, for other currencies',
    disclaimer: 'Mid-market rates are for reference and update daily.',
    updated: 'Updated:',
  },
  providers: {
    monoDescription: 'Monobank buy and sell rate',
    nbuName: 'NBU',
    nbuDescription: 'Official rate of the National Bank of Ukraine',
    marketName: 'Mid-market',
    marketDescription:
      'Mid-market rate from the open exchange-api (aggregated from several open sources, updated daily). For reference, not a bank rate',
  },
  card: {
    label: 'Currency converter',
    amountIn: (code: string) => `Amount in ${code}`,
    swap: 'Swap currencies',
    operation: 'Operation',
    buy: 'Buy',
    sell: 'Sell',
    unavailable: 'The rate for this pair is not available right now',
    bankCross: 'Monobank, cross rate',
    official: 'official rate',
    market: 'Mid-market',
    rateDate: 'Rate date',
    nbuRate: 'Official NBU rate',
  },
  select: {
    from: 'Convert from',
    to: 'Convert to',
    current: 'Now',
  },
  picker: {
    recent: 'Recent',
    popular: 'Popular',
    all: 'All currencies',
    crypto: 'Cryptocurrencies',
    metals: 'Precious metals',
    close: 'Close',
    placeholder: 'Code, name or country',
    search: 'Search currency',
    clear: 'Clear search',
    empty: (query: string) => `Nothing found for “${query}”`,
    results: 'Search results',
    bankTag: 'Monobank buy and sell rate',
    swapTag: 'swap',
    swapTagTitle: 'Currencies will trade places',
  },
  quickPick: {
    title: 'Quick pick',
    hint: (count: number) =>
      `The currencies you pick most often show up here first. Tap a currency in the card to see all ${count}.`,
  },
  slide: {
    sell: 'Sell:',
    buy: 'Buy:',
    cross: 'Cross rate:',
    open: (from: string, to: string) => `Open ${from} → ${to} in the converter`,
  },
};

export const MESSAGES: { [key in Lang]: Messages } = { uk, en };

/** The language picked in the switcher, or the browser language until then */
export const selectLang = (state: ExchangesState): Lang =>
  state.lang && LANGS.includes(state.lang) ? state.lang : detectLang();

export const useLang = () => useSelector(selectLang);

export const useT = () => MESSAGES[useLang()];
