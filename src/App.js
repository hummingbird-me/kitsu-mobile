import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import codePush from 'react-native-code-push';
import configureStore from './store/config';
import Root from './Router';

const store = configureStore();
class App extends Component {

  componentDidMount() {
    // these errors are library wornings. most of them will be resolved with newer versions
    console.disableYellowBox = true;
    // console.ignoredYellowBox = ['Warning: View.propTypes', 'Warning: BackAndroid is deprecated.'];
  }
  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <StatusBar
            translucent
            backgroundColor={'rgba(0, 0, 0, 0.3)'}
            barStyle={'light-content'}
          />
          <Root />
        </View>
      </Provider>
    );
  }
}

export default codePush(App);
