import React from 'react';
import { View, Text, WebView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { kitsuConfig } from 'kitsu/config/env/';
import { commonStyles } from 'kitsu/common/styles';
import { styles } from './styles';

class Board extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    tabBarVisible: false,
  });

  state = {
    token: null,
    loading: true,
  }

  componentDidMount() {
    this.getCannySsoToken();
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

  renderErrorComponent = () => (
    <View style={[commonStyles.centerCenter, { flex: 1 }]}>
      <Text style={styles.errorText}>Error loading the board.</Text>
    </View>
  )

  renderLoadingComponent = () => (
    <ActivityIndicator />
  )

  render() {
    const { ssoToken, loading } = this.state;
    const { navigation } = this.props;
    const boardToken = kitsuConfig.cannyBoardTokens[navigation.state.params.type];
    const uri = `https://webview.canny.io?boardToken=${boardToken}&ssoToken=${ssoToken}`;

    return (
      <View style={styles.wrapper}>
        {loading
          ? <View style={[commonStyles.centerCenter, { flex: 1 }]}>
            <ActivityIndicator />
          </View>
          : <WebView
            style={styles.webView}
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
