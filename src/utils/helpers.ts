import { SN } from '../types';
import { Decimal } from 'decimal.js';

export const inputFontSize = (val: SN= '') => {
  const length = String(val).length;
  const Kof = 24;
  let result = 1.5;
  if (length > 16 && length < 40) {
    result = new Decimal(Kof).div(length).toNumber(); 
  } else if (length > 40) {
    result = 0.6; 
  }
  return `${result}rem`;
}