import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Currency } from '../../types';
import getIcon from '../../utils/getIcon';
import { ExchangesState } from '../../store/types';
import { toFix } from '../../utils/formatCurrency';

interface IProps {
  precision: number;
  computedCurrency: Currency;
}

const ComputedBar: FC<IProps> = ({ precision, computedCurrency }: IProps) => {

  if (computedCurrency.computedPrice === null) {
    return null;
  }
  
  return (
    <div className='select-card__computed-bar'>
      <div className='select-card__row'>
        <object
          type="image/svg+xml"
          data={getIcon(computedCurrency.country || '', computedCurrency.code)}
          className="select-card__icon select-card__icon--m-right"
        >
        </object>
        { computedCurrency.currency }
      </div>
      <div className='select-card__computed-wrapper'>
        <span className='select-card__computed-value'>{toFix(computedCurrency.computedPrice, precision)}</span>
        <span className='select-card__computed-code'>{computedCurrency.code}</span>
      </div>
    </div>
  );
}

export default connect(
  ({ exchange: { precision = 4 }, computedCurrency }: ExchangesState) => ({ precision, computedCurrency })
)(ComputedBar);
