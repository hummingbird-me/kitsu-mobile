import React from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';

import { Kitsu, setToken } from 'kitsu/config/api';

import {
  ItemSeparator,
  SidebarButton,
  SidebarHeader,
  SidebarTitle,
} from './common';
import { styles } from './styles';

interface PrivacySettingsProps {
  componentId: any;
  accessToken?: string;
  currentUser?: object;
}

class PrivacySettings extends React.Component<PrivacySettingsProps> {
  static defaultProps = {
    accessToken: null,
    currentUser: {},
  };

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
        <SidebarHeader
          headerTitle={'Privacy'}
          onBackPress={() => Navigation.pop(this.props.componentId)}
        />
        <ScrollView style={{ flex: 1 }}>
          <SidebarTitle title={'Discoverability'} />
          <View style={styles.privacySettingsWrapper}>
            <Text style={styles.privacySettingsText}>
              Share posts to Global Feed
            </Text>
            <Switch
              value={shareToGlobal}
              onValueChange={(v) =>
                this.setState({ modified: true, shareToGlobal: v })
              }
            />
          </View>
          <ItemSeparator />
          <View style={styles.privacyTipsWrapper}>
            <Text style={styles.privacyTipsText}>
              If disabled, your posts will only be shared to your followers and
              guests to your profile.
            </Text>
          </View>
          <SidebarButton
            title={'Save Privacy Settings'}
            onPress={this.onSavePrivacySettings}
            loading={loading}
            disabled={!modified}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ auth, user }) => ({
  accessToken: auth.tokens.access_token,
  currentUser: user.currentUser,
});

export default connect(mapStateToProps, {})(PrivacySettings);
