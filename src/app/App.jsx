import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fetchCurrencies } from '../store/actions'; 
import { HomePage } from '../pages';
import AppHeader from '../components/header';
import 'antd/es/select/style/css';
import 'antd/es/dropdown/style/css';
import 'antd/es/skeleton/style/css';

class App extends PureComponent {

  componentDidMount() {
    this.props.fetchCurrencies();
  }
  
  render() {
    return (
      <div className="App">
        <AppHeader/>
        <HomePage/>
      </div>
    );
  }
};

const mapDispatchToProps = {
  fetchCurrencies
};

export default connect(null, mapDispatchToProps)(App);
