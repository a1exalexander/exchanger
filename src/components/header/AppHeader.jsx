import React from 'react';
import AppCarousel from '../carousel';

const AppHeader = () => {
  return (
    <header className="app-header">
      <nav className='app-header__nav'>
        <a href="/" className="app-header__link">
          <h1 className="app-header__title">Exchanger</h1>
        </a>
      </nav>
      <AppCarousel/>
    </header>
  );
};

export default AppHeader;
