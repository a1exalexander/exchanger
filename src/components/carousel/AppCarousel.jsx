import React from 'react';
import AppSlide from './AppSlide';

const AppCarousel = () => {
  
  const slides = () => {
    const count = [...Array(20).keys()];
    return count.map((el, index) => {
      return <AppSlide key={el} name={el}/>;
    });
  };

  return (
    <div class="app-carousel">
      <ul class="app-carousel__track">
        {slides()}
      </ul>
    </div>
  );
};

export default AppCarousel;
