import React, { FC } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { ExchangesState } from '../../store/types';
import { ReactComponent as IconMerge } from '../../assets/images/merge.svg';

interface Props {
  className?: string;
}

export const AppFooter: FC<Props> = ({ className = '' }) => {
  const { lastUpdate } = useSelector((state: ExchangesState) => state);
  return (
    <footer className={classNames('app-footer', className)}>
      <div className="app-footer__inner">
        <div className="app-footer__info-card">
          <h2 className="app-footer__description">
            Конвертуй іноземну валюту та українську гривню за курсом{' '}
            <a
              href="https://www.monobank.com.ua/"
              target="_blank"
              rel="noopener noreferrer"
              className="app-footer__description app-footer__description--eng app-footer__description--link"
            >
              Monobank
            </a>{' '}
            та{' '}
            <a
              href="https://bank.gov.ua/"
              target="_blank"
              rel="noopener noreferrer"
              className="app-footer__description app-footer__description--mark app-footer__description--link"
            >
              НБУ
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
        <a
          href="https://merge.rocks/"
          target="_blank"
          rel="noopener noreferrer"
          className="app-footer__icon-wrapper"
        >
          <IconMerge className="app-footer__icon" />
        </a>
        Developed by&nbsp;
        <a
          className="app-footer__author-link"
          href="https://www.linkedin.com/in/alexander-ratushnyi/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Alex Ratushnyi
        </a>
      </div>
    </footer>
  );
};
