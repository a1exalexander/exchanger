import React from 'react';
import AppCarousel from '../carousel';
import appLogo from '../../assets/images/currencies.svg';

const AppHeader = () => {
  return (
    <header className="app-header">
      <nav className='app-header__nav'>
        <a href="/" className="app-header__link">
          <object className="app-header__logo" data={appLogo} type="image/svg+xml"></object>
          <h1 className="app-header__title">UAH Exchanger</h1>
        </a>
      </nav>
      <AppCarousel/>
    </header>
  );
};

export default AppHeader;
