import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ExchangesState } from '../store/types';
import { resolveExchange } from '../utils/resolveExchange';
import { buildCurrencyOptions } from '../utils/currencyMeta';

export const DESKTOP_QUERY = '(min-width: 860px)';

export const useMediaQuery = (query: string) => {
  const getMatch = () =>
    typeof window !== 'undefined' && !!window.matchMedia?.(query).matches;
  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    const media = window.matchMedia?.(query);
    if (!media) return;
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, [query]);

  return matches;
};

/** The exchange for the currently selected pair */
export const useExchange = () => {
  const pair = useSelector((state: ExchangesState) => state.pair);
  const currencies = useSelector((state: ExchangesState) => state.currencies);
  const market = useSelector((state: ExchangesState) => state.market);
  return useMemo(
    () => resolveExchange(pair, currencies, market),
    [pair, currencies, market],
  );
};

export const useCurrencyOptions = () => {
  const currencies = useSelector((state: ExchangesState) => state.currencies);
  const market = useSelector((state: ExchangesState) => state.market);
  return useMemo(
    () => buildCurrencyOptions(currencies, market),
    [currencies, market],
  );
};
