import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { Provider, connect } from 'react-redux';

import codePush from 'react-native-code-push';
import PropTypes from 'prop-types';
import configureStore from './store/config';
import Root from './Router';

const store = configureStore();
class App extends Component {
  componentDidMount() {
    console.disableYellowBox = !__DEV__;
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRoot />
      </Provider>
    );
  }
}

const RootContainer = ({ badge }) => (
  <View style={{ flex: 1 }}>
    <StatusBar translucent backgroundColor={'rgba(0, 0, 0, 0.3)'} barStyle={'light-content'} />
    <Root screenProps={{ badge }} />
  </View>
);

RootContainer.propTypes = {
  badge: PropTypes.number.isRequired,
};

const ConnectedRoot = connect(({ feed }) => ({
  badge: feed.notificationsUnseen,
}))(RootContainer);

export default codePush(App);
