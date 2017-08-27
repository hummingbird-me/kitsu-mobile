import React from 'react';
import { View, WebView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { CannyBoard } from 'kitsu/components/CannyBoard';
import { commonStyles } from 'kitsu/common/styles';
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
    this.getCannySsoToken();
  }

  getCannySsoToken = async () => {
    const { accessToken } = this.props;
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

  render() {
    const { loading, ssoToken } = this.state;
    return (
      <View style={styles.containerStyle}>
        {loading
          ? <View style={[commonStyles.centerCenter, { flex: 1 }]}>
            <ActivityIndicator />
          </View>
          : <CannyBoard type={'bugReport'} token={ssoToken} />
        }
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
