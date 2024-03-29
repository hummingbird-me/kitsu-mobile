import * as Sentry from '@sentry/react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { LoginManager } from 'react-native-fbsdk-next';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';

import fblogo from 'kitsu/assets/img/fblogo.png';
import * as colors from 'kitsu/constants/colors';
import { connectFBUser, disconnectFBUser } from 'kitsu/store/user/actions';

import { ItemSeparator, SidebarHeader, SidebarTitle } from './common';
import { styles } from './styles';

interface LinkedAccountsProps {
  componentId: any;
  currentUser?: object;
}

class LinkedAccounts extends React.Component<LinkedAccountsProps> {
  static defaultProps = {
    currentUser: {},
  };

  handleFacebookLinking = async (isLinked) => {
    if (isLinked) {
      // if linked, unlink the account
      this.props.disconnectFBUser();
    } else {
      // link the account
      LoginManager.logOut();
      LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
        (result) => {
          if (!result.isCancelled) {
            this.props.connectFBUser();
          }
        },
        (error) => {
          Sentry.captureMessage('FBSDK - Facebook Login Failed', {
            extra: {
              error,
            },
          });
          console.log(`Login fail with error: ${error}`);
        }
      );
    }
  };

  renderFacebookAccount = () => {
    const { currentUser } = this.props;
    const isLinked = currentUser.facebookId !== null;
    return (
      <View style={styles.item}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 90, alignItems: 'center' }}>
              <FastImage
                source={fblogo}
                style={{ resizeMode: 'contain', width: 90, height: 40 }}
              />
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => this.handleFacebookLinking(isLinked)}
            style={{
              backgroundColor: isLinked ? colors.darkGrey : colors.green,
              height: 24,
              minWidth: 70,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 8,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: 'OpenSans',
                fontWeight: '600',
                color: colors.white,
              }}
            >
              {isLinked ? 'Disconnect' : 'Connect'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.containerStyle}>
        <SidebarHeader
          headerTitle={'Linked Accounts'}
          onBackPress={() => Navigation.pop(this.props.componentId)}
        />
        <ScrollView style={{ flex: 1 }}>
          <SidebarTitle title={'Social Accounts'} />
          {this.renderFacebookAccount()}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ auth, user }) => ({
  accessToken: auth.tokens.access_token,
  currentUser: user.currentUser,
});

export default connect(mapStateToProps, { connectFBUser, disconnectFBUser })(
  LinkedAccounts
);
