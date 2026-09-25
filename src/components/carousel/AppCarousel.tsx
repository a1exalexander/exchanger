import React, { FC } from 'react';
import AppSlide from './AppSlide';
import { useSelector } from 'react-redux';
import { Exchange } from '../../types';
import { ExchangesState } from '../../store/types';
import { Skeleton } from '../ui';

interface AppCarouselProps {
  className?: string;
}

const AppCarousel: FC<AppCarouselProps> = ({ className }) => {
  const currencies = useSelector((state: ExchangesState) => state.currencies);
  const loading = useSelector((state: ExchangesState) => state.loading);

  const loadingCards = () =>
    Array.from({ length: 8 }, (_, index) => (
      <li key={index} className="app-slide app-slide--skeleton">
        <Skeleton rows={3} className="app-slide__skeleton" />
      </li>
    ));

  return (
    <div className={className}>
      <div
        className="app-carousel"
        uk-slider="center: true; autoplay: true; autoplay-interval: 4000; velocity: 0.1"
      >
        <div className="uk-position-relative uk-visible-toggle">
          <ul className="uk-slider-items uk-grid">
            {loading && !currencies.length
              ? loadingCards()
              : currencies.map((exchange: Exchange) => (
                  <AppSlide key={exchange.id} exchange={exchange} />
                ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppCarousel;
