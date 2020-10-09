import Big from 'big.js';
import { SN } from '../types';

export default class CalcCurrency {

  _isNumber = (val: SN | Big) => {
    return !Number.isNaN(Number(val));
  }
  
  calcByA = (val: SN | Big, rate: SN | Big, funcA: any, funcB: any) => {
    if (this._isNumber(val)) {
      funcA(val);
      const result = val !== '' ? new Big(val).mul(rate) : '';
      funcB(result);
    }
  }

  calcByB = (val: SN | Big, rate: SN | Big, funcA: any, funcB: any) => {
    if (this._isNumber(val)) {
      funcA(val);
      const result = val !== '' ? new Big(Number(val)).div(rate) : ''
      funcB(result);
    }
  }

  calcMul = (num: any, rate: SN) => {
    return num !== '' ? new Big(num).mul(rate).toString() : '';
  }

  calcDiv = (num: any, rate: SN) => {
    return num !== '' ? new Big(num).div(rate).toString() : '';
  }
}