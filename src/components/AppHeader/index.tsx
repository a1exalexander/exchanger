import React, { FC } from 'react';
import { AppCarousel } from '../carousel';
import { ReactComponent as AppLogo } from '../../assets/images/Flag_of_Ukraine.svg';
import { ThemeToggle } from '../ui';

export const AppHeader: FC = () => (
  <header className="app-header">
    <nav className="app-header__nav">
      <a href="/" aria-label="UAH Exchanger — на головну" className="app-header__link">
        <AppLogo className="app-header__logo" />
        <span className="app-header__title">UAH Exchanger</span>
      </a>
      <ThemeToggle className="app-header__theme" />
    </nav>
    <AppCarousel />
  </header>
);
