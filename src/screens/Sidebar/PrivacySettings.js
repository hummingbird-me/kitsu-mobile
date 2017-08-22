import React, { Component } from 'react';
import { View, Image, Switch } from 'react-native';
import { connect } from 'react-redux';
import { Text, Button, Container, Content, Spinner } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import menu from 'kitsu/assets/img/tabbar_icons/menu.png';
import { Kitsu, setToken } from 'kitsu/config/api';
import { SidebarHeader, SidebarTitle, ItemSeparator } from './common/';

class PrivacySettings extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => <SidebarHeader navigation={navigation} headerTitle={'Privacy'} />,
    tabBarIcon: ({ tintColor }) => (
      <Image source={menu} style={{ tintColor, width: 20, height: 21 }} />
    ),
  });

  state = {
    loading: true,
    shareToGlobal: false,
  };

  componentDidMount() {
    this.fetchPrivacySettings();
  }

  onSavePrivacySettings = async () => {
    const { accessToken, currentUser } = this.props;
    setToken(accessToken.token);
    this.setState({ loading: true });
    try {
      await Kitsu.update('users', { id: currentUser.id, shareToGlobal: this.state.shareToGlobal });
      this.setState({
        shareToGlobal: this.state.shareToGlobal,
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
  }

  render() {
    const loading = this.state.loading;
    const { shareToGlobal } = this.state;
    return (
      <Container style={styles.containerStyle}>
        <Content scrollEnabled={false}>
          <View style={{ flex: 1, marginTop: 77 }}>
            <SidebarTitle style={{ marginTop: 20 }} title={'Personal Settings'} />
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
            <View style={{ marginTop: 20, padding: 10, paddingLeft: 25, paddingRight: 25 }}>
              <Button
                block
                disabled={false && loading}
                onPress={this.onSavePrivacySettings}
                style={{
                  backgroundColor: colors.green,
                  height: 47,
                  borderRadius: 3,
                }}
              >
                {loading
                  ? <Spinner size="small" color="rgba(255,255,255,0.4)" />
                  : <Text
                    style={{
                      color: colors.white,
                      fontFamily: 'OpenSans-Semibold',
                      lineHeight: 20,
                      fontSize: 14,
                    }}
                  >
                      Save Privacy Settings
                    </Text>}
              </Button>
            </View>
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

PrivacySettings.propTypes = {};

export default connect(mapStateToProps, {})(PrivacySettings);
