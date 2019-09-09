import { Decimal } from 'decimal.js';

export default class CalcCurrency {

  _isNumber = (val) => {
    return !Number.isNaN(Number(val));
  }
  
  calcByA = (val, rate, funcA, funcB) => {
    if (this._isNumber(val)) {
      funcA(val);
      funcB(new Decimal(Number(val)).mul(Number(rate)).toFixed(4));
    }
  }

  calcByB = (val, rate, funcA, funcB) => {
    if (this._isNumber(val)) {
      funcA(val);
      funcB(new Decimal(Number(val)).div(Number(rate)).toFixed(4));
    }
  }
}