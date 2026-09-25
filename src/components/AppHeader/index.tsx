import React, { FC } from 'react';
import { AppCarousel } from '../carousel';
import { AppLogo, ThemeToggle } from '../ui';

export const AppHeader: FC = () => (
  <header className="app-header">
    <nav className="app-header__nav">
      <a href="/" aria-label="Exchanger — на головну" className="app-header__link">
        <AppLogo className="app-header__logo" />
        <span className="app-header__title">Exchanger</span>
      </a>
      <ThemeToggle className="app-header__theme" />
    </nav>
    <AppCarousel />
  </header>
);
