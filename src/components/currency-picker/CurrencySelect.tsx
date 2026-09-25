import React, { FC, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { ExchangesState } from '../../store/types';
import { setCurrency } from '../../store/actions';
import { getCurrencyName } from '../../utils/currencyMeta';
import { CurrencyIcon } from '../ui/CurrencyIcon';
import { IconChevron } from '../ui/icons';
import { CurrencyPicker } from './CurrencyPicker';

interface Props {
  side: 'from' | 'to';
  className?: string;
}

const TITLES = {
  from: 'Яку валюту конвертуємо?',
  to: 'У яку валюту конвертуємо?',
};

export const CurrencySelect: FC<Props> = ({ side, className }) => {
  const dispatch = useDispatch();
  const pair = useSelector((state: ExchangesState) => state.pair);
  const market = useSelector((state: ExchangesState) => state.market);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const value = pair[side];
  const other = side === 'from' ? pair.to : pair.from;
  const name = getCurrencyName(value, market);

  const onClose = useCallback(() => setOpen(false), []);
  const onSelect = useCallback(
    (code: string) => {
      dispatch(setCurrency(side, code));
      setOpen(false);
    },
    [dispatch, side],
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={classNames('currency-select', className, { _open: open })}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${TITLES[side]} Зараз: ${value}, ${name}`}
      >
        <CurrencyIcon code={value} size={32} className="currency-select__icon" />
        <span className="currency-select__text">
          <span className="currency-select__code">{value}</span>
          <span className="currency-select__name">{name}</span>
        </span>
        <IconChevron className="currency-select__chevron" />
      </button>
      <CurrencyPicker
        open={open}
        anchor={buttonRef.current}
        value={value}
        other={other}
        title={TITLES[side]}
        onSelect={onSelect}
        onClose={onClose}
      />
    </>
  );
};
