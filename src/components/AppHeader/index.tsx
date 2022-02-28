import React, { FC } from 'react';
import { AppCarousel } from '../carousel';
// import { ReactComponent as AppLogo } from '../../assets/images/currencies.svg';

export const AppHeader: FC = () => {
  return (
    <header className="app-header">
      <span className="app-header__help">Натисни тут, щоб вибрати валюту</span>
      <nav className="app-header__nav">
        <a href="/" className="app-header__link">
          {/* <AppLogo className="app-header__logo" /> */}
          <h2 className="app-header__title">Русский корабль, иди нахуй!</h2>
        </a>
      </nav>
      <AppCarousel />
    </header>
  );
};
