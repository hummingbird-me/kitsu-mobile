import { View, Text, WebView, ActivityIndicator } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import { cannyBoardTokens } from 'kitsu/config/env/';
import { commonStyles } from 'kitsu/common/styles';
import { styles } from './styles';

const renderLoadingComponent = () => (
  <ActivityIndicator />
);

const renderErrorComponent = () => (
  <View style={[commonStyles.centerCenter, { flex: 1 }]}>
    <Text style={styles.errorText}>Error loading the board.</Text>
  </View>
);

export const CannyBoard = ({ type, token }) => {
  const boardToken = cannyBoardTokens[type];
  return (
    <View style={styles.wrapper}>
      <WebView
        style={styles.webView}
        source={{
          uri: `https://webview.canny.io?boardToken=${boardToken}&ssoToken=${token}`,
        }}
        renderLoading={renderLoadingComponent}
        renderError={renderErrorComponent}
      />
    </View>
  );
};

CannyBoard.propTypes = {
  type: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

CannyBoard.defaultProps = {
  type: null,
  token: null,
};
