import React, { FC } from 'react';
import classNames from 'classnames';
import { IconGlobe } from './icons';

export type RateProvider = 'mono' | 'nbu' | 'market';

export const RATE_PROVIDERS: {
  [key in RateProvider]: { name: string; description: string; url: string };
} = {
  mono: {
    name: 'Monobank',
    description: 'Курс купівлі та продажу Monobank',
    url: 'https://www.monobank.ua/rates',
  },
  nbu: {
    name: 'НБУ',
    description: 'Офіційний курс Національного банку України',
    url: 'https://bank.gov.ua/ua/markets/exchangerates',
  },
  market: {
    name: 'Середньоринковий',
    description:
      'Середньоринковий курс з відкритого API exchange-api (зведені дані кількох відкритих джерел, оновлюється щодня). Довідковий, не курс банку',
    url: 'https://github.com/fawazahmed0/exchange-api',
  },
};

/** Tiny badge identifying where a rate comes from */
export const SourceMark: FC<{ provider: RateProvider; className?: string }> = ({
  provider,
  className,
}) => (
  <span
    className={classNames('source-mark', `source-mark--${provider}`, className)}
    aria-hidden="true"
  >
    {provider === 'mono' && 'm'}
    {provider === 'nbu' && 'НБУ'}
    {provider === 'market' && <IconGlobe />}
  </span>
);
