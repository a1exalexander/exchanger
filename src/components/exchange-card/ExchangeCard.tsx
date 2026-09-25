import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Big from 'big.js';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'usehooks-ts';
import { SET_RATE_VALUE } from '../../constants';
import { setMethod, swapPair } from '../../store/actions';
import { ExchangeMethod, ExchangesState } from '../../store/types';
import { Exchange, ExchangeSource, SN } from '../../types';
import { useExchange } from '../../hooks';
import { formatAmount, formatRate, parseAmount } from '../../utils/formatCurrency';
import { inputFontSize } from '../../utils/helpers';
import { CurrencySelect } from '../currency-picker';
import {
  IconSwap,
  providerDescription,
  RATE_PROVIDERS,
  RateProvider,
  Skeleton,
  SourceMark,
} from '../ui';
import { Messages, useT } from '../../i18n';
import { ReactComponent as IconArrow } from '../../assets/images/profits.svg';

type Side = 'from' | 'to';

interface IBaseProps {
  className?: string;
}

const getRate = (exchange: Exchange | undefined, method: ExchangeMethod) => {
  if (!exchange) return undefined;
  const rates: { [key in ExchangeMethod]?: SN } = {
    sell: exchange.rateBuy,
    buy: exchange.rateSell,
    cross: exchange.NB?.rate || exchange.rateCross,
  };
  const rate = rates[method] || rates.cross;
  return rate && Number(rate) ? new Big(rate) : undefined;
};

const convert = (value: string, rate: Big | undefined, side: Side) => {
  if (!rate || value === '' || value === '.') return '';
  try {
    return side === 'from' ? new Big(value).times(rate) : new Big(value).div(rate);
  } catch {
    return '';
  }
};

const prefersReducedMotion = () =>
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const SWAP_EASING = 'cubic-bezier(0.34, 1.36, 0.64, 1)';

const getSource = (
  t: Messages,
  source: ExchangeSource,
): { provider: RateProvider; label: string } =>
  ({
    bank: { provider: 'mono' as RateProvider, label: 'Monobank' },
    'bank-cross': { provider: 'mono' as RateProvider, label: t.card.bankCross },
    nbu: { provider: 'nbu' as RateProvider, label: t.card.official },
    market: { provider: 'market' as RateProvider, label: t.card.market },
  }[source]);

const ExchangeCard: FC<IBaseProps> = ({ className = '' }) => {
  const dispatch = useDispatch();
  const method = useSelector((state: ExchangesState) => state.method);
  const pair = useSelector((state: ExchangesState) => state.pair);
  const loading = useSelector((state: ExchangesState) => state.loading);
  const exchange = useExchange();
  const t = useT();

  const [amount, setAmount] = useState<{ side: Side; value: string }>({
    side: 'from',
    value: '1',
  });
  const [touched, setTouched] = useState(false);
  const [swapTurns, setSwapTurns] = useState(0);
  const debouncedAmount = useDebounce(amount, 1000);
  const fieldRefs = {
    from: useRef<HTMLDivElement>(null),
    to: useRef<HTMLDivElement>(null),
  };
  const swapOffset = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!touched || !debouncedAmount.value) return;
    window.posthog?.capture?.(SET_RATE_VALUE, {
      [`${SET_RATE_VALUE}/value`]: Number(debouncedAmount.value),
      [`${SET_RATE_VALUE}/method`]: method,
      [`${SET_RATE_VALUE}/code`]: pair[debouncedAmount.side],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAmount]);

  // after a swap each field slides in from where the other one was,
  // so both currencies visibly trade places
  useLayoutEffect(() => {
    const offset = swapOffset.current;
    swapOffset.current = null;
    if (!offset || prefersReducedMotion()) return;
    const options = { duration: 460, easing: SWAP_EASING };
    fieldRefs.from.current?.animate?.(
      [
        { transform: `translate(${offset.x}px, ${offset.y}px)`, opacity: 0.4 },
        { transform: 'none', opacity: 1 },
      ],
      options,
    );
    fieldRefs.to.current?.animate?.(
      [
        { transform: `translate(${-offset.x}px, ${-offset.y}px)`, opacity: 0.4 },
        { transform: 'none', opacity: 1 },
      ],
      options,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapTurns]);

  const onSwap = () => {
    const from = fieldRefs.from.current?.getBoundingClientRect();
    const to = fieldRefs.to.current?.getBoundingClientRect();
    if (from && to) {
      swapOffset.current = { x: to.left - from.left, y: to.top - from.top };
    }
    // the typed amount travels together with its currency
    setAmount((current) => ({
      ...current,
      side: current.side === 'from' ? 'to' : 'from',
    }));
    setSwapTurns((turns) => turns + 1);
    dispatch(swapPair());
  };

  const rate = getRate(exchange, method);
  const computed = convert(amount.value, rate, amount.side);
  // the field being typed in keeps exactly what the user entered
  const values = {
    from: amount.side === 'from' ? amount.value : formatAmount(computed),
    to: amount.side === 'to' ? amount.value : formatAmount(computed),
  };
  const hasBuySell = !!exchange?.rateBuy && !!exchange?.rateSell;
  const unavailable = !exchange && !loading;

  const onChange = (side: Side) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseAmount(event.target.value);
    if (value === null) return;
    setTouched(true);
    setAmount({ side, value });
  };

  const renderField = (side: Side) => {
    const value = values[side];
    return (
      <div ref={fieldRefs[side]} className={`exchange-field exchange-field--${side}`}>
        <CurrencySelect side={side} className="exchange-field__select" />
        {exchange || !loading ? (
          <input
            className="exchange-field__input"
            style={{ fontSize: inputFontSize(value) }}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            aria-label={t.card.amountIn(pair[side])}
            value={value}
            placeholder="0"
            disabled={unavailable}
            onChange={onChange(side)}
            onFocus={(event) => event.target.select()}
          />
        ) : (
          <Skeleton rows={1} className="exchange-field__skeleton" />
        )}
      </div>
    );
  };

  const methodIndex = method === 'sell' ? 1 : 0;

  return (
    <section
      className={classNames('exchange-card', className)}
      aria-label={t.card.label}
    >
      <div className="exchange-card__main">
        {renderField('from')}
        <div className="exchange-card__middle">
          <button
            type="button"
            className="exchange-card__swap"
            onClick={onSwap}
            aria-label={t.card.swap}
            title={t.card.swap}
          >
            <IconSwap
              className="exchange-card__swap-icon"
              style={{ transform: `rotate(${swapTurns * 180}deg)` }}
            />
          </button>
        </div>
        {renderField('to')}
      </div>

      {hasBuySell && (
        <div className="exchange-card__meta">
          <div
            className={classNames('segmented', method)}
            role="radiogroup"
            aria-label={t.card.operation}
            style={{ '--segmented-index': methodIndex } as React.CSSProperties}
          >
            <span className="segmented__thumb" aria-hidden="true" />
            {(['buy', 'sell'] as ExchangeMethod[]).map((item) => (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={method === item}
                className={classNames('segmented__item', item, {
                  _active: method === item,
                })}
                onClick={() => dispatch(setMethod(item))}
              >
                {item === 'buy' ? t.card.buy : t.card.sell} {pair.from}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className={classNames('exchange-card__summary', hasBuySell ? method : 'cross')}
        aria-live="polite"
      >
        {unavailable ? (
          <span>{t.card.unavailable}</span>
        ) : exchange && rate ? (
          <RateLine exchange={exchange} rate={rate} from={pair.from} to={pair.to} />
        ) : (
          <span>&nbsp;</span>
        )}
      </div>
    </section>
  );
};

/** The single place where the rate is shown: readable direction + where it comes from */
const RateLine: FC<{ exchange: Exchange; rate: Big; from: string; to: string }> = ({
  exchange,
  rate,
  from,
  to,
}) => {
  // show "1 USD = 45.41 UAH" rather than "1 UAH = 0.022 USD"
  const direct = rate.gte(1);
  const [base, quote] = direct ? [from, to] : [to, from];
  const value = direct ? rate : new Big(1).div(rate);
  const grow = exchange.grow ? Number(exchange.grow) : 0;
  const growUp = direct ? grow === 1 : grow === -1;
  const t = useT();

  const { provider, label } = getSource(t, exchange.source || 'market');
  const info = RATE_PROVIDERS[provider];
  const details = [providerDescription(t, provider)];
  if (provider === 'market' && exchange.date) {
    details.push(`${t.card.rateDate}: ${moment(exchange.date).format('DD.MM.YYYY')}`);
  }
  if (exchange.source === 'bank' && exchange.NB?.rate) {
    // already expressed as 1 `from` = x `to`, also for reversed pairs
    const nbu = new Big(exchange.NB.rate);
    const nbuValue = direct ? nbu : new Big(1).div(nbu);
    details.push(`${t.card.nbuRate}: 1 ${base} = ${formatRate(nbuValue)} ${quote}`);
  }
  const text = `1 ${base} = ${formatRate(value)} ${quote}`;

  return (
    <>
      <span key={text} className="exchange-card__rate">
        {text}
        {!!grow && (
          <IconArrow
            className={classNames('exchange-card__grow', {
              _up: growUp,
              _down: !growUp,
            })}
            aria-label={growUp ? t.card.rateUp : t.card.rateDown}
          />
        )}
      </span>
      <a
        className="exchange-card__source"
        href={info.url}
        target="_blank"
        rel="noopener noreferrer"
        title={details.join('\n')}
        data-posthog-link={`rate-source-${provider}`}
      >
        <SourceMark provider={provider} />
        {label}
      </a>
    </>
  );
};

export default ExchangeCard;
