import React, { FC } from 'react';
import AppSlide from './AppSlide';
import { connect } from 'react-redux';
import { setExchange } from '../../store/actions';
import { Skeleton } from 'antd';
import { Currencies, Exchange } from '../../types';

interface AppCarouselProps {
  loading: boolean;
  currencies: Currencies;
  className?: string;
}

const AppCarousel: FC<AppCarouselProps> = ({
  loading,
  currencies,
  className,
}) => {
  const slides = () => {
    return currencies.map((exchange: Exchange, index: number) => {
      return <AppSlide key={index + 1} exchange={exchange} />;
    });
  };

  const loadingCards = () => {
    const countArray: any = new Array(20).keys();
    const count: any = [...countArray];
    return count.map((el: any, index: number) => {
      return (
        <li key={index} className="app-slide app-slide--skeleton">
          <Skeleton
            className="app-slide__skeleton"
            active
            paragraph={{ rows: 3 }}
            title={false}
          />
        </li>
      );
    });
  };

  return (
    <div className={className}>
      <div
        className="app-carousel"
        uk-slider="center: true; autoplay: true; autoplay-interval: 4000; velocity: 0.1"
      >
        <div className="uk-position-relative uk-visible-toggle">
          <ul className="uk-slider-items uk-grid">
            {loading && !currencies.length ? loadingCards() : slides()}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ currencies, loading }: { currencies: Currencies; loading: boolean }) => ({
    currencies,
    loading,
  }),
  { setExchange }
)(AppCarousel);
