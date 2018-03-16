import React from 'react';
import { View, Text, WebView, ActivityIndicator, Keyboard, Platform } from 'react-native';
import { connect } from 'react-redux';
import { kitsuConfig } from 'kitsu/config/env/';
import { commonStyles } from 'kitsu/common/styles';
import WKWebView from 'react-native-wkwebview-reborn';
import { navigationOptions } from 'kitsu/screens/Sidebar/common';
import { styles } from './styles';

class Board extends React.Component {
  static navigationOptions = ({ navigation }) => (
    navigationOptions(navigation, navigation.state.params.title)
  );

  state = {
    token: null,
    loading: true,
    keyboardHeight: 0,
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    this.getCannySsoToken();
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
    this.keyboardDidShowListener.remove();
  }

  getCannySsoToken = async () => {
    const accessToken = this.props.navigation.state.params.token;
    try {
      const response = await fetch('https://kitsu.io/api/edge/sso/canny', {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const json = await response.json();
      if (json && json.token) {
        this.setState({
          ssoToken: json.token,
          loading: false,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  keyboardDidShow = ({ endCoordinates: { height } }) => {
    this.setState({ keyboardHeight: height });
  }

  keyboardDidHide = () => {
    this.setState({ keyboardHeight: 0 });
  }


  renderErrorComponent = () => (
    <View style={[commonStyles.centerCenter, { flex: 1 }]}>
      <Text style={styles.errorText}>Error loading the board.</Text>
    </View>
  )

  renderLoadingComponent = () => (
    <ActivityIndicator />
  )

  render() {
    const { ssoToken, loading, keyboardHeight } = this.state;
    const { navigation } = this.props;
    const boardToken = kitsuConfig.cannyBoardTokens[navigation.state.params.type];
    const uri = `https://webview.canny.io?boardToken=${boardToken}&ssoToken=${ssoToken}`;
    const Web = Platform.OS === 'ios' ? WKWebView : WebView;
    const adjustProperty = Platform.OS === 'ios' ? 'paddingBottom' : 'marginBottom';

    return (
      <View style={styles.wrapper}>
        {loading
          ? <View style={[commonStyles.centerCenter, { flex: 1 }]}>
            <ActivityIndicator />
          </View>
          : <Web
            style={[styles.webView, { [adjustProperty]: keyboardHeight }]}
            source={{
              uri,
            }}
            renderLoading={this.renderLoadingComponent}
            renderError={this.renderErrorComponent}
          />
        }
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  accessToken: auth.tokens.access_token,
});

export const CannyBoard = connect(mapStateToProps, {})(Board);
