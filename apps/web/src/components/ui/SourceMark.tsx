import React, { FC } from 'react';
import classNames from 'classnames';
import { IconGlobe } from './icons';
import { Messages, useT } from '../../i18n';

export type RateProvider = 'mono' | 'nbu' | 'market';

export const RATE_PROVIDERS: { [key in RateProvider]: { url: string } } = {
  mono: { url: 'https://www.monobank.ua/rates' },
  nbu: { url: 'https://bank.gov.ua/ua/markets/exchangerates' },
  market: { url: 'https://github.com/fawazahmed0/exchange-api' },
};

export const providerDescription = (t: Messages, provider: RateProvider) =>
  ({
    mono: t.providers.monoDescription,
    nbu: t.providers.nbuDescription,
    market: t.providers.marketDescription,
  }[provider]);

/** Tiny badge identifying where a rate comes from */
export const SourceMark: FC<{ provider: RateProvider; className?: string }> = ({
  provider,
  className,
}) => {
  const t = useT();
  return (
    <span
      className={classNames('source-mark', `source-mark--${provider}`, className)}
      aria-hidden="true"
    >
      {provider === 'mono' && 'm'}
      {provider === 'nbu' && t.providers.nbuName}
      {provider === 'market' && <IconGlobe />}
    </span>
  );
};
