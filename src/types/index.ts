export type SN = string | number;

export interface Currency {
  code: string;
  number: SN;
  digits: SN;
  currency: string;
  countries: Array<string>;
  country: string;
}

export interface Exchange {
  currencyCodeA: SN;
  currencyCodeB: SN;
  date: string;
  rateBuy?: SN;
  rateSell?: SN;
  rateCross?: SN;
  currencyA: Currency;
  currencyB: Currency;
}

export type Currencies = Array<Exchange>;