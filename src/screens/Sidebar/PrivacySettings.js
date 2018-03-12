import React from 'react';
import { View, Switch, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Kitsu, setToken } from 'kitsu/config/api';
import { navigationOptions, SidebarTitle, ItemSeparator, SidebarButton } from './common/';
import { styles } from './styles';

class PrivacySettings extends React.Component {
  static navigationOptions = ({ navigation }) => navigationOptions(navigation, 'Privacy');

  state = {
    modified: false,
    loading: true,
    shareToGlobal: false,
  };

  componentDidMount() {
    this.fetchPrivacySettings();
  }

  onSavePrivacySettings = async () => {
    const { shareToGlobal } = this.state;
    const { accessToken, currentUser } = this.props;
    setToken(accessToken);
    this.setState({ loading: true });
    try {
      await Kitsu.update('users', { id: currentUser.id, shareToGlobal });
      this.setState({
        shareToGlobal,
        loading: false,
      });
    } catch (e) {
      this.setState({
        error: 'Failed to set privacy settings',
        loading: false,
      });
    }
  };

  fetchPrivacySettings = async () => {
    const token = this.props.accessToken;
    setToken(token);
    try {
      const user = await Kitsu.findAll('users', {
        fields: { users: 'shareToGlobal' },
        filter: { self: true },
      });
      this.setState({
        loading: false,
        shareToGlobal: user[0].shareToGlobal,
      });
    } catch (e) {
      this.setState({
        error: 'Failed to fetch privacy settings',
        loading: false,
      });
    }
  };

  render() {
    const loading = this.state.loading;
    const { shareToGlobal, modified } = this.state;
    return (
      <View style={styles.containerStyle}>
        <SidebarTitle title={'Discoverability'} />
        <View
          style={styles.privacySettingsWrapper}
        >
          <Text style={styles.privacySettingsText}>Share posts to Global Feed</Text>
          <Switch
            value={shareToGlobal}
            onValueChange={v => this.setState({ modified: true, shareToGlobal: v })}
          />
        </View>
        <ItemSeparator />
        <View style={styles.privacyTipsWrapper}>
          <Text style={styles.privacyTipsText}>
            If disabled, your posts will only be shared to your followers and guests to your profile.
          </Text>
        </View>
        <SidebarButton
          title={'Save Privacy Settings'}
          onPress={this.onSavePrivacySettings}
          loading={loading}
          disabled={!modified}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ auth, user }) => ({
  accessToken: auth.tokens.access_token,
  currentUser: user.currentUser,
});

PrivacySettings.propTypes = {
  accessToken: PropTypes.string,
  currentUser: PropTypes.object,
};

PrivacySettings.defaultProps = {
  accessToken: null,
  currentUser: {},
};

export default connect(mapStateToProps, {})(PrivacySettings);
