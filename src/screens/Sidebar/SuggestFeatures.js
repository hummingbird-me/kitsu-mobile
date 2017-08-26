import React from 'react';
import { View, Image, Text, WebView, Spinner } from 'react-native';
import { connect } from 'react-redux';
import * as colors from 'kitsu/constants/colors';
import { Kitsu, setToken } from 'kitsu/config/api';
import { cannyBoardTokens } from 'kitsu/constants/app';
import PropTypes from 'prop-types';
import styles from './styles';

class SuggestFeatures extends React.Component {
  static navigationOptions = {
    title: 'Suggest Features',
  };

  state = {
    loading: false,
  };

  getCannySsoKey = async () => {
    const { accessToken, currentUser } = this.props;
    setToken(accessToken);
    this.setState({ loading: true });
    try {
      // execute request. > will continue later after fixing pr review stuff.
    } catch (e) {
      // catch.
    }
  };

  render() {
    const { navigation } = this.props;
    const { loading } = this.state;
    const ssoToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJyZWFkIiwiZmVlZF9pZCI6Im5vdGlmaWNhdGlvbnMxNjA3NTAifQ.1c8JErTHKC-gtyxy0dsZhKtORr-dCH9vJ4pfrfWmrh4';
    return (
      <View style={styles.containerStyle}>
        {loading
          ? <Spinner />
          : <WebView
            style={{ flex: 1 }}
            source={{
              uri: `https://webview.canny.io?boardToken=${cannyBoardTokens.featureRequest}&ssoToken=${ssoToken}`,
            }}
          />}
      </View>
    );
  }
}

const mapStateToProps = ({ auth, user }) => ({
  currentUser: user.currentUser,
  accessToken: auth.tokens.access_token,
});

SuggestFeatures.propTypes = {};

export default connect(mapStateToProps, {})(SuggestFeatures);
