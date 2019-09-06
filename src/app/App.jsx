import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fetchCurrencies } from '../store/actions'; 
import { HomePage } from '../pages';
import AppHeader from '../components/header';

class App extends PureComponent {

  componentDidMount() {
    this.props.fetchCurrencies();
  }
  
  render() {
    const { loading, hasError } = this.props;

    return (
      <div className="App">
        <AppHeader/>
        <HomePage/>
      </div>
    );
  }
};

const mapStateToProps = ({ currencies, loading, hasError }) => {
  return { currencies, loading, hasError };
};

const mapDispatchToProps = {
  fetchCurrencies
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
