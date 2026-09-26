import React, { FC } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import 'moment/locale/uk';
import { useSelector } from 'react-redux';
import { ExchangesState } from '../../store/types';
import { Lang, useLang, useT } from '../../i18n';
import { useCurrencyOptions } from '../../hooks';
import {
  providerDescription,
  RATE_PROVIDERS,
  RateProvider,
  SourceMark,
  ThemeToggle,
} from '../ui';

interface Props {
  className?: string;
}

const formatUpdate = (value: string, lang: Lang) => {
  const date = moment(value, moment.ISO_8601, true);
  // older app versions stored an already formatted date
  return date.isValid() ? date.locale(lang).format('DD MMMM, YYYY') : value;
};

export const AppFooter: FC<Props> = ({ className = '' }) => {
  const lastUpdate = useSelector((state: ExchangesState) => state.lastUpdate);
  const lang = useLang();
  const t = useT();
  const currencyCount = useCurrencyOptions().length;

  const sources: { provider: RateProvider; label: string; note: string }[] = [
    { provider: 'mono', label: 'Monobank', note: t.footer.monoNote },
    { provider: 'nbu', label: t.providers.nbuName, note: t.footer.nbuNote },
    { provider: 'market', label: 'exchange-api', note: t.footer.marketNote },
  ];

  return (
    <footer className={classNames('app-footer', className)}>
      <div className="app-footer__inner">
        <div className="app-footer__sources">
          <h2 className="app-footer__title">{t.footer.sources}</h2>
          <ul className="app-footer__list">
            {sources.map(({ provider, label, note }) => (
              <li key={provider} className="app-footer__source">
                <SourceMark provider={provider} />
                <span>
                  <a
                    href={RATE_PROVIDERS[provider].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-posthog-link={provider}
                    title={providerDescription(t, provider)}
                    className="app-footer__link"
                  >
                    {label}
                  </a>
                  <span className="app-footer__note">— {note}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="app-footer__disclaimer">{t.footer.disclaimer}</p>
          <p className="app-footer__disclaimer">{t.quickPick.hint(currencyCount)}</p>
        </div>
        {lastUpdate && (
          <div className="app-footer__date-card">
            {t.footer.updated}{' '}
            <span className="app-footer__date">{formatUpdate(lastUpdate, lang)}</span>
          </div>
        )}
      </div>
      <div className="app-footer__bottom">
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
        <ThemeToggle className="app-footer__theme" />
      </div>
    </footer>
  );
};
