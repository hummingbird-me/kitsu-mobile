import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import codePush from 'react-native-code-push';
import configureStore from './store/config';
import Root from './Router';

const store = configureStore();
class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}

export default codePush(App);
