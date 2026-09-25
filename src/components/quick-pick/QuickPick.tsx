import React, { FC } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { ExchangesState } from '../../store/types';
import { setCurrency } from '../../store/actions';
import { QUICK_PICK } from '../../utils/currencyMeta';
import { useCurrencyOptions } from '../../hooks';
import { CurrencyIcon } from '../ui';

export const QuickPick: FC<{ className?: string }> = ({ className }) => {
  const dispatch = useDispatch();
  const pair = useSelector((state: ExchangesState) => state.pair);
  const options = useCurrencyOptions();
  const available = new Set(options.map(({ code }) => code));
  const codes = QUICK_PICK.filter((code) => available.has(code));

  return (
    <section className={classNames('quick-pick', className)} aria-labelledby="quick-pick-title">
      <h2 id="quick-pick-title" className="quick-pick__title">
        Швидкий вибір
      </h2>
      <div className="quick-pick__list">
        {codes.map((code) => {
          const active = pair.from === code;
          return (
            <button
              key={code}
              type="button"
              className={classNames('quick-pick__chip', { _active: active })}
              aria-pressed={active}
              onClick={() => dispatch(setCurrency('from', code))}
            >
              <CurrencyIcon code={code} size={20} />
              {code}
            </button>
          );
        })}
      </div>
      <p className="quick-pick__hint">
        Натисни на валюту в картці, щоб обрати будь-яку з{' '}
        <b>{options.length}</b> валют — фіат, криптовалюти та метали.
      </p>
    </section>
  );
};
