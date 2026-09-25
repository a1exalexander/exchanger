import React, { FC, useEffect, useState } from 'react';
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
import { IconSwap, RATE_PROVIDERS, RateProvider, Skeleton, SourceMark } from '../ui';
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

const SOURCE: {
  [key in ExchangeSource]: { provider: RateProvider; label: string };
} = {
  bank: { provider: 'mono', label: 'Курс Monobank' },
  'bank-cross': { provider: 'mono', label: 'Крос-курс Monobank' },
  nbu: { provider: 'nbu', label: 'Офіційний курс НБУ' },
  market: { provider: 'market', label: 'Середньоринковий курс' },
};

const ExchangeCard: FC<IBaseProps> = ({ className = '' }) => {
  const dispatch = useDispatch();
  const method = useSelector((state: ExchangesState) => state.method);
  const pair = useSelector((state: ExchangesState) => state.pair);
  const loading = useSelector((state: ExchangesState) => state.loading);
  const exchange = useExchange();

  const [amount, setAmount] = useState<{ side: Side; value: string }>({
    side: 'from',
    value: '1',
  });
  const [touched, setTouched] = useState(false);
  const debouncedAmount = useDebounce(amount, 1000);

  useEffect(() => {
    if (!touched || !debouncedAmount.value) return;
    window.posthog?.capture?.(SET_RATE_VALUE, {
      [`${SET_RATE_VALUE}/value`]: Number(debouncedAmount.value),
      [`${SET_RATE_VALUE}/method`]: method,
      [`${SET_RATE_VALUE}/code`]: pair[debouncedAmount.side],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAmount]);

  const rate = getRate(exchange, method);
  const inverseRate = rate ? new Big(1).div(rate) : undefined;
  const computed = convert(amount.value, rate, amount.side);
  const raw = {
    from: amount.side === 'from' ? amount.value : computed,
    to: amount.side === 'to' ? amount.value : computed,
  };
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
    const code = pair[side];
    const other = side === 'from' ? pair.to : pair.from;
    const sideRate = side === 'from' ? rate : inverseRate;
    const grow = side === 'from' && exchange?.grow ? Number(exchange.grow) : 0;
    const value = values[side];
    return (
      <div className={`exchange-field exchange-field--${side}`}>
        <CurrencySelect side={side} className="exchange-field__select" />
        {exchange || !loading ? (
          <input
            className="exchange-field__input"
            style={{ fontSize: inputFontSize(value) }}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            aria-label={`Сума в ${code}`}
            value={value}
            placeholder="0"
            disabled={unavailable}
            onChange={onChange(side)}
            onFocus={(event) => event.target.select()}
          />
        ) : (
          <Skeleton rows={1} className="exchange-field__skeleton" />
        )}
        <div className="exchange-field__rate">
          {sideRate ? (
            <>
              1 {code} = {formatRate(sideRate)} {other}
              {!!grow && (
                <IconArrow
                  className={classNames('exchange-field__grow', {
                    _up: grow === 1,
                    _down: grow === -1,
                  })}
                  aria-label={grow === 1 ? 'Курс зріс' : 'Курс знизився'}
                />
              )}
            </>
          ) : (
            ' '
          )}
        </div>
      </div>
    );
  };

  const fromLabel = formatAmount(raw.from) || '0';
  const toLabel = formatAmount(raw.to) || '0';
  const nbu = exchange?.source === 'bank' ? exchange.NB?.rate : undefined;

  return (
    <section
      className={classNames('exchange-card', className)}
      aria-label="Конвертер валют"
    >
      <div className="exchange-card__main">
        {renderField('from')}
        <div className="exchange-card__middle">
          <button
            type="button"
            className="exchange-card__swap"
            onClick={() => dispatch(swapPair())}
            aria-label="Поміняти валюти місцями"
            title="Поміняти валюти місцями"
          >
            <IconSwap />
          </button>
        </div>
        {renderField('to')}
      </div>

      <div className="exchange-card__meta">
        {hasBuySell ? (
          <div className="segmented" role="radiogroup" aria-label="Операція">
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
                {item === 'buy' ? 'Купую' : 'Продаю'} {pair.from}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        {exchange && <RateSource exchange={exchange} nbu={nbu} from={pair.from} to={pair.to} />}
      </div>

      <button
        type="button"
        onClick={() => hasBuySell && dispatch(setMethod(method === 'buy' ? 'sell' : 'buy'))}
        className={classNames('exchange-card__summary', hasBuySell ? method : 'cross', {
          _static: !hasBuySell,
        })}
        tabIndex={hasBuySell ? 0 : -1}
        aria-live="polite"
      >
        {unavailable ? (
          <span>Курс для цієї пари зараз недоступний</span>
        ) : hasBuySell ? (
          <span>
            {method === 'buy' ? 'Придбаю' : 'Продам'}{' '}
            <b>
              {fromLabel} {pair.from}
            </b>{' '}
            за{' '}
            <b>
              {toLabel} {pair.to}
            </b>
          </span>
        ) : (
          <span>
            <b>
              {fromLabel} {pair.from}
            </b>{' '}
            ={' '}
            <b>
              {toLabel} {pair.to}
            </b>
          </span>
        )}
      </button>
    </section>
  );
};

const RateSource: FC<{
  exchange: Exchange;
  nbu?: number;
  from: string;
  to: string;
}> = ({ exchange, nbu, from, to }) => {
  const { provider, label } = SOURCE[exchange.source || 'market'];
  const info = RATE_PROVIDERS[provider];
  const date =
    provider === 'market' && exchange.date
      ? ` · ${moment(exchange.date).format('DD.MM.YYYY')}`
      : '';
  return (
    <div className="rate-source">
      <a
        className="rate-source__main"
        href={info.url}
        target="_blank"
        rel="noopener noreferrer"
        title={info.description}
        data-posthog-link={`rate-source-${provider}`}
      >
        <SourceMark provider={provider} />
        <span>
          {label}
          {date}
        </span>
      </a>
      {nbu ? (
        <span
          className="rate-source__ref"
          title="Офіційний курс НБУ — для порівняння, в розрахунку не використовується"
        >
          <SourceMark provider="nbu" />
          <span>
            офіційний:{' '}
            {exchange.reversed
              ? `1 ${to} = ${formatRate(new Big(1).div(nbu))} ${from}`
              : `1 ${from} = ${formatRate(nbu)} ${to}`}
          </span>
        </span>
      ) : null}
    </div>
  );
};

export default ExchangeCard;
