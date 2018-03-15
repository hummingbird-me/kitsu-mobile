import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { upperFirst, toLower } from 'lodash';
import { connect } from 'react-redux';
import { Button } from 'kitsu/components/Button';
import { defaultAvatar } from 'kitsu/constants/app';
import { kitsu as kitsuLogo, aozora as aozoraLogo } from 'kitsu/assets/img/onboarding/';
import {
  resolveAccountConflicts,
  setSelectedAccount,
  setScreenName,
  completeOnboarding,
} from 'kitsu/store/onboarding/actions';
import { styles } from './styles';
import { styles as commonStyles } from '../common/styles';

const AccountView = ({ style, data, selected, onSelectAccount }) => {
  const { libraryCount, username, profileImageURL, accountType } = data;
  const selectedRowStyle = selected ? commonStyles.rowSelected : null;
  const selectedTextStyle = selected ? commonStyles.textSelected : null;
  return (
    <TouchableOpacity
      onPress={() => onSelectAccount(data.accountType)}
      style={[commonStyles.rowWrapper, selectedRowStyle, style]}
    >
      <FastImage style={styles.profileImage} source={{ uri: profileImageURL || defaultAvatar }} />
      <View style={styles.textWrapper}>
        <Text style={[commonStyles.text, selectedTextStyle]}>{username}</Text>
        <Text style={[styles.libraryCount, selectedTextStyle]}>
          {libraryCount ? `${libraryCount} library entries` : 'Empty Library'}
        </Text>
      </View>
      <FastImage style={styles.brandImage} source={accountType === 'kitsu' ? kitsuLogo : aozoraLogo} />
    </TouchableOpacity>
  );
};

class SelectAccountScreen extends React.Component {
  state = {
    selectedAccount: 'kitsu',
  };

  onSelectAccount = (accountType) => {
    this.setState({ selectedAccount: accountType });
  };

  onConfirm = async () => {
    const { selectedAccount } = this.state;
    const success = this.props.resolveAccountConflicts(selectedAccount);
    if (success) {
      this.props.setSelectedAccount(selectedAccount);
      // If user selected kitsu account then send them right into the app!
      if (selectedAccount === 'kitsu') {
        this.completeOnboarding();
      } else {
        this.props.setScreenName('CreateAccountScreen');
        this.props.navigation.navigate('CreateAccountScreen');
      }
    }
  };

  completeOnboarding = () => {
    this.props.completeOnboarding(this.props.navigation);
  };

  render() {
    const { selectedAccount } = this.state;
    const { accounts, loading } = this.props;
    return (
      <View style={commonStyles.container}>
        <View style={commonStyles.contentWrapper}>
          <Text style={commonStyles.tutorialText}>
            Oh, you already have a Kitsu account!{'\n'}
            Which do you want to keep?
          </Text>
          {accounts ? (
            <View>
              <AccountView
                style={{ marginTop: 16 }}
                selected={selectedAccount === 'aozora'}
                onSelectAccount={this.onSelectAccount}
                data={{
                  username: accounts.aozora.name,
                  profileImageURL: accounts.aozora.avatar,
                  libraryCount: accounts.aozora.library_entries,
                  accountType: 'aozora',
                }}
              />
              <AccountView
                selected={selectedAccount === 'kitsu'}
                onSelectAccount={this.onSelectAccount}
                data={{
                  username: accounts.kitsu.name,
                  profileImageURL: accounts.kitsu.avatar,
                  libraryCount: accounts.kitsu.library_entries,
                  accountType: 'kitsu',
                }}
              />
              <Text style={styles.ps}>
                Activity feed posts from both accounts will be merged. All other account information
                will be overwritten by the account you select above.
              </Text>
              <Button
                loading={loading}
                style={{ marginHorizontal: 0, marginTop: 24 }}
                onPress={this.onConfirm}
                title={`Keep ${upperFirst(toLower(selectedAccount))} account`}
                titleStyle={commonStyles.buttonTitleStyle}
              />
            </View>
          ) : (
            <View style={{ height: 140, justifyContent: 'center' }}>
              <ActivityIndicator />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ onboarding, user }) => {
  const { conflicts: accounts } = onboarding;
  const { loading, error } = user;
  return { loading, error, accounts };
};

export default connect(mapStateToProps, {
  resolveAccountConflicts,
  setSelectedAccount,
  setScreenName,
  completeOnboarding,
})(SelectAccountScreen);
