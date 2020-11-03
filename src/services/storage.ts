import { isArray } from 'lodash';

type StorageDataType = object[] | object;

class Storage {
  alias: string = '';

  constructor(name: string) {
    this.alias = name;
  }

  set(data: StorageDataType) {
    if (this.alias && data) {
      localStorage.setItem(this.alias, JSON.stringify(data));
    }
  }
  get() {
    const storageData = localStorage.getItem(this.alias);
    if (storageData && storageData !== 'undefined') {
      return JSON.parse(storageData);
    }
    return null;
  }
  have() {
    const data = this.get();
    if (isArray(data)) return !!data.length;
    return !!data;
  }
}

export const exchangeStorage = new Storage('exchange');
export const currenciesStorage = new Storage('exchanger-currenices');
export const monoStorage = new Storage('mono-currenicies');
export const nbStorage = new Storage('nb-currenicies');
export const pbStorage = new Storage('pb-currenicies');
export const btcStorage = new Storage('btc-currenicies');
export const historyStorage = new Storage('history-currenicies');
