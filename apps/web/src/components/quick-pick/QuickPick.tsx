import React, { FC, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { ExchangesState } from '../../store/types';
import { setCurrency } from '../../store/actions';
import { rankQuickPick, USAGE_EVENT } from '../../utils/currencyMeta';
import { useCurrencyOptions } from '../../hooks';
import { CurrencyIcon } from '../ui';
import { useT } from '../../i18n';

export const QuickPick: FC<{ className?: string }> = ({ className }) => {
  const dispatch = useDispatch();
  const pair = useSelector((state: ExchangesState) => state.pair);
  const options = useCurrencyOptions();
  const t = useT();
  const available = useMemo(() => new Set(options.map(({ code }) => code)), [options]);
  const [codes, setCodes] = useState(() => rankQuickPick(available));

  useEffect(() => setCodes(rankQuickPick(available)), [available]);

  // re-rank only when a currency that isn't shown yet gets used:
  // chips never jump around under the finger
  useEffect(() => {
    const onUsage = (event: Event) => {
      const code = (event as CustomEvent<string>).detail;
      setCodes((current) => (current.includes(code) ? current : rankQuickPick(available)));
    };
    window.addEventListener(USAGE_EVENT, onUsage);
    return () => window.removeEventListener(USAGE_EVENT, onUsage);
  }, [available]);

  return (
    <section className={classNames('quick-pick', className)} aria-labelledby="quick-pick-title">
      <h2 id="quick-pick-title" className="quick-pick__title">
        {t.quickPick.title}
      </h2>
      <div className="quick-pick__list">
        {codes.map((code, index) => {
          const active = pair.from === code;
          return (
            <button
              key={code}
              type="button"
              className={classNames('quick-pick__chip', { _active: active })}
              style={{ animationDelay: `${index * 30}ms` }}
              aria-pressed={active}
              onClick={() => dispatch(setCurrency('from', code))}
            >
              <CurrencyIcon code={code} size={20} />
              {code}
            </button>
          );
        })}
      </div>
    </section>
  );
};
