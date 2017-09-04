import React from 'react';
import { View, Text, WebView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { kitsuConfig } from 'kitsu/config/env/';
import { commonStyles } from 'kitsu/common/styles';
import { styles } from './styles';

class Board extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  });

  state = {
    token: null,
    loading: true,
  }

  componentDidMount() {
    this.getCannySsoToken();
  }

  getCannySsoToken = () => {
    const accessToken = this.props.navigation.state.params.token;
    fetch('https://kitsu.io/api/edge/sso/canny', {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => response.json())
    .then((responseJson) => {
      if (responseJson && responseJson.token) {
        this.setState({
          ssoToken: responseJson.token,
          loading: false,
        });
      }
    });
  };

  renderErrorComponent = () => (
    <View style={[commonStyles.centerCenter, { flex: 1 }]}>
      <Text style={styles.errorText}>Error loading the board.</Text>
    </View>
  )

  renderLoadingComponent = () => (
    <ActivityIndicator />
  )

  render() {
    const { token, loading } = this.state;
    const { navigation } = this.props;
    const boardToken = kitsuConfig.cannyBoardTokens[navigation.state.params.type];

    return (
      <View style={styles.wrapper}>
        {loading
          ? <View style={[commonStyles.centerCenter, { flex: 1 }]}>
            <ActivityIndicator />
          </View>
          : <WebView
            style={styles.webView}
            source={{
              uri: `https://webview.canny.io?boardToken=${boardToken}&ssoToken=${token}`,
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
