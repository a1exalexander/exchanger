export type SN = string | number;

export interface Currency {
  code: string;
  number?: SN;
  digits?: SN;
  currency: string;
  countries?: Array<string>;
  country?: string | undefined;
  name?: string;
  computedPrice?: SN | null;
}

export interface NBRate {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
}

export interface Exchange {
  id: SN;
  currencyCodeA: SN;
  currencyCodeB: SN;
  date?: string;
  rateBuy?: SN;
  rateSell?: SN;
  rateCross?: SN;
  currencyA: Currency;
  currencyB: Currency;
  precision?: number;
  NB?: NBRate;
  grow?: Number;
}

export type Currencies = Array<Exchange>;