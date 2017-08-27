import React from 'react';
import { View, Switch, Text } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { Kitsu, setToken } from 'kitsu/config/api';
import { SidebarTitle, ItemSeparator, SidebarButton } from './common/';

class PrivacySettings extends React.Component {
  static navigationOptions = {
    title: 'Privacy',
  };

  state = {
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
    const { shareToGlobal } = this.state;
    return (
      <Container style={styles.containerStyle}>
        <Content scrollEnabled={false}>
          <View style={{ flex: 1, marginTop: 77 }}>
            <SidebarTitle title={'Personal Settings'} />
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                paddingHorizontal: 12,
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 14 }}>Share posts to Global Feed</Text>
              <Switch
                value={shareToGlobal}
                onValueChange={v => this.setState({ shareToGlobal: v })}
              />
            </View>
            <ItemSeparator />
            <View style={{ backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8 }}>
              <Text style={{ fontSize: 10, color: 'grey' }}>
                If disabled, your posts will only be shared to your followers and guests to your profile.
              </Text>
            </View>
            <SidebarButton
              title={'Save Privacy Settings'}
              onPress={this.onSavePrivacySettings}
              loading={loading}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = {
  containerStyle: { backgroundColor: colors.listBackPurple },
};

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
