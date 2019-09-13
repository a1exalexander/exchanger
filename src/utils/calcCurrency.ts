import { Decimal } from 'decimal.js';
import { SN } from '../types';

export default class CalcCurrency {

  _isNumber = (val: SN) => {
    return !Number.isNaN(Number(val));
  }
  
  calcByA = (val: SN, rate: SN, funcA: any, funcB: any) => {
    if (this._isNumber(val)) {
      funcA(val);
      funcB(new Decimal(Number(val)).mul(Number(rate)).toFixed(4));
    }
  }

  calcByB = (val: SN, rate: SN, funcA: any, funcB: any) => {
    if (this._isNumber(val)) {
      funcA(val);
      funcB(new Decimal(Number(val)).div(Number(rate)).toFixed(4));
    }
  }
}