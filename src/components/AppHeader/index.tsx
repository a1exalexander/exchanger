import React, { FC } from 'react';
import { AppCarousel } from '../carousel';
import { ReactComponent as AppLogo } from '../../assets/images/Flag_of_Ukraine.svg';
import { Switch } from 'antd';
import { useDispatch } from 'react-redux';
import { SET_THEME } from '../../constants';
import { useSelector } from 'react-redux';
import { ExchangesState } from '../../store/types';

export const AppHeader: FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((store: ExchangesState) => store.theme);
  return (
    <header className="app-header">
      <span className="app-header__help">Натисни тут, щоб вибрати валюту</span>
      <nav className="app-header__nav">
        <a href="/" aria-label='link to home' className="app-header__link">
          <AppLogo className="app-header__logo" />
          <h2 className="app-header__title">UAH Exchanger</h2>
        </a>
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
          className="app-header__switch"
        />
      </nav>
      <AppCarousel />
    </header>
  );
};
