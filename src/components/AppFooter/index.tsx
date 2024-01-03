import React, { FC } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { ExchangesState } from '../../store/types';
import { Switch } from 'antd';
import { useDispatch } from 'react-redux';
import { SET_THEME } from '../../constants';

interface Props {
  className?: string;
}

export const AppFooter: FC<Props> = ({ className = '' }) => {
  const dispatch = useDispatch();
  const theme = useSelector((store: ExchangesState) => store.theme);
  const lastUpdate = useSelector((state: ExchangesState) => state.lastUpdate);
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
        Developed by&nbsp;
        <a
          className="app-footer__author-link"
          href="https://www.linkedin.com/in/alexander-ratushnyi/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Oleksandr Ratushnyi
        </a>
      </div>
      <div className='app-footer__switch-wrapper'>
        <Switch
          onChange={(checked) => {
            dispatch({
              type: SET_THEME,
              payload: checked ? 'light' : 'dark',
            });
          }}
          checked={theme === 'light'}
          checkedChildren="☀️"
          unCheckedChildren="🌙"
          className="app-footer__switch"
        />
      </div>
    </footer>
  );
};
