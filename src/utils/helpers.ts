import { SN } from '../types';
import Big from 'big.js';

export const inputFontSize = (val: SN | Big = '') => {
  const length = String(val).length;
  const Kof = 24;
  let result: SN | Big = 1.5;
  if (length > 16 && length < 40) {
    result = new Big(Kof).div(length); 
  } else if (length > 40) {
    result = 0.6; 
  }
  return `${result}rem`;
}

export const has = (obj: object, key: string) => {
  if (typeof obj !== 'object') return false;
  return Object.prototype.hasOwnProperty.call(obj, key);
}