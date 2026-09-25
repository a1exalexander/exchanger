import React, { FC } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { ExchangesState } from '../../store/types';

interface Props {
  className?: string;
}

export const AppFooter: FC<Props> = ({ className = '' }) => {
  const lastUpdate = useSelector((state: ExchangesState) => state.lastUpdate);
  return (
    <footer className={classNames('app-footer', className)}>
      <div className="app-footer__inner">
        <div className="app-footer__info-card">
          <h2 className="app-footer__description">
            Конвертуй гривню та понад 200 валют світу за курсом{' '}
            <a
              href="https://www.monobank.com.ua/"
              target="_blank"
              rel="noopener noreferrer"
              data-posthog-link="monobank"
              className="app-footer__description app-footer__description--eng app-footer__description--link"
            >
              Monobank
            </a>{' '}
            та{' '}
            <a
              href="https://bank.gov.ua/"
              target="_blank"
              data-posthog-link="NBU"
              rel="noopener noreferrer"
              className="app-footer__description app-footer__description--mark app-footer__description--link"
            >
              НБУ
            </a>
            {' '}або за{' '}
            <a
              href="https://github.com/fawazahmed0/exchange-api"
              target="_blank"
              data-posthog-link="exchange-api"
              rel="noopener noreferrer"
              className="app-footer__description app-footer__description--link"
            >
              ринковим курсом
            </a>
          </h2>
        </div>
        {lastUpdate && (
          <div className="app-footer__date-card">
            <span>Останнє оновлення:</span>{' '}
            <span className="app-footer__date">{lastUpdate}</span>
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
