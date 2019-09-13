import React from 'react';
import AppSlide from './AppSlide';
import { connect } from 'react-redux';
import { Skeleton } from 'antd';
import { Currencies, Exchange } from '../../types';

interface AppCarouselProps {
  loading: boolean;
  currencies: Currencies;
}

const AppCarousel = ({ loading, currencies }: AppCarouselProps) => {
  
  const slides = () => {
    return currencies.map((exchange: Exchange, index: number) => {
      return (<AppSlide key={index+1} exchange={exchange}/>);
    });
  };
  
  const loadingCards = () => {
    const countArray: any = new Array(20).keys();
    const count: any = [...countArray];
    return count.map((el: any, index: number) => {
      return (<li key={index} className="app-slide app-slide--skeleton">
        <Skeleton className='app-slide__skeleton' active paragraph={{rows: 3}} title={false}/>
      </li>);
    });
  }

  return (
    <div className="app-carousel">
      <ul className="app-carousel__track">
        {loading ? loadingCards() : slides()}
      </ul>
    </div>
  );
};

const mapStateToProps = ({ currencies, loading }: { currencies: Currencies, loading: boolean }) => {
  return { currencies, loading }
}

export default connect(mapStateToProps)(AppCarousel);
