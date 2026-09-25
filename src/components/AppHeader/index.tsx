import React, { FC } from 'react';
import { AppCarousel } from '../carousel';
import { AppLogo, LangSwitch } from '../ui';
import { useT } from '../../i18n';

export const AppHeader: FC = () => {
  const t = useT();
  return (
    <header className="app-header">
      <nav className="app-header__nav">
        <a href="/" aria-label={t.header.home} className="app-header__link">
          <AppLogo className="app-header__logo" />
          <span className="app-header__title">Exchanger</span>
        </a>
        <LangSwitch className="app-header__lang" />
      </nav>
      <AppCarousel />
    </header>
  );
};
