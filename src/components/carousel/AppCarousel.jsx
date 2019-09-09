import React from 'react';
import AppSlide from './AppSlide';
import { connect } from 'react-redux';
import { Skeleton } from 'antd';

const AppCarousel = ({ loading, currencies, method }) => {
  
  const slides = () => {
    return currencies.map((exchange, index) => {
      return <AppSlide key={index+1} exchange={exchange} method={method}/>;
    });
  };
  
  const loadingCards = () => {
    const count = [...Array(20).keys()];
    return count.map((el, index) => {
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

const mapStateToProps = ({ currencies, loading }) => {
  return { currencies, loading }
}

export default connect(mapStateToProps)(AppCarousel);
