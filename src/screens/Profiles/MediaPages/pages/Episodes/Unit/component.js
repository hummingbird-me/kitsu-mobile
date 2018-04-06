import React, { PureComponent } from 'react';
import { View, WebView, Platform, ActivityIndicator, Text } from 'react-native';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import WKWebView from 'react-native-wkwebview-reborn';
import HuluHTML from 'kitsu/assets/html/hulu-iframe';
import { ErrorPage } from 'kitsu/screens/Profiles/components/ErrorPage';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import * as colors from 'kitsu/constants/colors';

export default class Episode extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    header: () => {
      return (
        <CustomHeader
          leftButtonAction={() => navigation.goBack(null)}
          leftButtonTitle="Back to Episodes"
          backgroundColor={colors.listBackPurple}
        />
      );
    },
  });

  state = {
    hasErrored: false,
  };

  onMessage = (event) => {
    const { nativeEvent: { data } } = event;
    switch (data) {
      case 'loaded':
        const [video] = this.props.navigation.state.params.unit.videos;
        // Either no video source, or geo-blocked by API
        if (!video) {
          return this.setState({ hasErrored: true });
        }
        this.webview.postMessage('initialize');
        break;
      default:
        console.debug('react-native:', data);
        break;
    }
  };

  renderLoading = () => (
    <SceneLoader />
  );

  renderError = () => (
    <ErrorPage onBackPress={() => this.props.navigation.goBack(null)} />
  );

  render() {
    const WebComponent = Platform.OS === 'ios' ? WKWebView : WebView;
    return (
      <View style={{ flex: 1, backgroundColor: colors.listBackPurple }}>
        {hasErrored ? this.renderError() : (
          <WebComponent
            ref={ref => { this.webview = ref; }}
            style={{ flex: 1 }}
            source={{ html: HuluHTML }}
            onMessage={this.onMessage}
            renderLoading={this.renderLoading}
            renderError={this.renderError}
          />
        )}
      </View>
    );
  }
};
