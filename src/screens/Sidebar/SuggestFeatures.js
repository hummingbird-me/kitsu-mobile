import React from 'react';
import { View, Image, Text, WebView } from 'react-native';
import { connect } from 'react-redux';
import * as colors from 'kitsu/constants/colors';
import PropTypes from 'prop-types';
import styles from './styles';

class SuggestFeatures extends React.Component {
  static navigationOptions = {
    title: 'Suggest Features',
  };

  state = {};

  render() {
    const { navigation } = this.props;
    const boardToken =
      '6ba87283dd21e61641123f1d8f9b4d6939dd6a03cdb4c231e7404e833d5706b1955338ea439f3a107dbbfe0ad9dcfdd8d44188059b5cad8b074df768ec2c8e1932e6625292ce2d965b7f5e59587b838cb1cde41f0b36d097362e2f96a31b1e65675271263445c6f31a46809de82b90602ff850bc9e311d8e6dd4ba0a9a76a399d064b4dc568f09a0c253977f44cbaf21';
    const ssoToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZXNvdXJjZSI6IioiLCJhY3Rpb24iOiJyZWFkIiwiZmVlZF9pZCI6Im5vdGlmaWNhdGlvbnMxNjA3NTAifQ.1c8JErTHKC-gtyxy0dsZhKtORr-dCH9vJ4pfrfWmrh4';
    return (
      <View style={styles.containerStyle}>
        <WebView
          style={{ flex: 1 }}
          source={{ uri: `https://webview.canny.io?boardToken=${boardToken}&ssoToken=${ssoToken}` }}
        />
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
