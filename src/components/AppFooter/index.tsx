import React, { FC } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { ExchangesState } from '../../store/types';
import { RATE_PROVIDERS, RateProvider, SourceMark } from '../ui';

interface Props {
  className?: string;
}

const SOURCES: { provider: RateProvider; label: string; note: string }[] = [
  { provider: 'mono', label: 'Monobank', note: 'купівля та продаж' },
  { provider: 'nbu', label: 'НБУ', note: 'офіційний курс' },
  {
    provider: 'market',
    label: 'exchange-api',
    note: 'середньоринковий, для інших валют',
  },
];

export const AppFooter: FC<Props> = ({ className = '' }) => {
  const lastUpdate = useSelector((state: ExchangesState) => state.lastUpdate);
  return (
    <footer className={classNames('app-footer', className)}>
      <div className="app-footer__inner">
        <div className="app-footer__sources">
          <h2 className="app-footer__title">Джерела курсів</h2>
          <ul className="app-footer__list">
            {SOURCES.map(({ provider, label, note }) => (
              <li key={provider} className="app-footer__source">
                <SourceMark provider={provider} />
                <span>
                  <a
                    href={RATE_PROVIDERS[provider].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-posthog-link={provider}
                    title={RATE_PROVIDERS[provider].description}
                    className="app-footer__link"
                  >
                    {label}
                  </a>
                  <span className="app-footer__note">— {note}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="app-footer__disclaimer">
            Середньоринкові курси довідкові й оновлюються щодня.
          </p>
        </div>
        {lastUpdate && (
          <div className="app-footer__date-card">
            Оновлено: <span className="app-footer__date">{lastUpdate}</span>
          </div>
        )}
      </div>
      <div className="app-footer__author">
        Developed by&nbsp;
        <a
          className="app-footer__author-link"
          href="https://sashkoratushnyi.com"
          target="_blank"
          data-posthog-link="portfolio"
          rel="noopener noreferrer"
        >
          Oleksandr Ratushnyi
        </a>
      </div>
    </footer>
  );
};
