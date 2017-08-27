import React from 'react';
import { View, WebView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { cannyBoardTokens } from 'kitsu/constants/app';
import PropTypes from 'prop-types';
import styles from './styles';

class ReportBugs extends React.Component {
  static navigationOptions = {
    title: 'Report Bugs',
  };

  state = {
    loading: true,
  };

  componentDidMount() {
    this.getCannySsoKey();
  }

  getCannySsoKey = async () => {
    const { accessToken } = this.props;
    fetch('https://kitsu.io/api/edge/sso/canny', {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${accessToken}`,
        'Host': 'kitsu.io',
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

  render() {
    const { loading, ssoToken } = this.state;
    return (
      <View style={styles.containerStyle}>
        {loading
          ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
          </View>
          : <WebView
            style={{ flex: 1 }}
            source={{
              uri: `https://webview.canny.io?boardToken=${cannyBoardTokens.bugReport}&ssoToken=${ssoToken}`,
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

ReportBugs.propTypes = {};

export default connect(mapStateToProps, {})(ReportBugs);
