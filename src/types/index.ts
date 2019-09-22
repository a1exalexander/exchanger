export type SN = string | number;

export interface Currency {
  code: string;
  number?: SN;
  digits?: SN;
  currency: string;
  countries?: Array<string>;
  country?: string | undefined;
  name?: string;
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
}

export type Currencies = Array<Exchange>;