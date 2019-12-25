import React from 'react';
import AppCarousel from '../carousel';
import { ReactComponent as AppLogo } from '../../assets/images/currencies.svg';

const AppHeader = () => {
  return (
    <header className="app-header">
      <span className='app-header__help'>Tap here to select currencies</span>
      <nav className='app-header__nav'>
        <a href="/" className="app-header__link">
          <AppLogo className="app-header__logo"/>
          <h1 className="app-header__title">UAH Exchanger</h1>
        </a>
      </nav>
      <AppCarousel/>
    </header>
  );
};

export default AppHeader;
