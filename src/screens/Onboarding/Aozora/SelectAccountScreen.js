import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { upperFirst, toLower } from 'lodash';
import { connect } from 'react-redux';
import { Button } from 'kitsu/components/Button';
import { defaultAvatar } from 'kitsu/constants/app';
import { kitsu as kitsuLogo, aozora as aozoraLogo } from 'kitsu/assets/img/onboarding/';
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
      <Image style={styles.profileImage} source={{ uri: profileImageURL || defaultAvatar }} />
      <View style={styles.textWrapper}>
        <Text style={[commonStyles.text, selectedTextStyle]}>{username}</Text>
        <Text style={[styles.libraryCount, selectedTextStyle]}>
          {libraryCount ? `${libraryCount} library entries` : 'Empty Library'}
        </Text>
      </View>
      <Image style={styles.brandImage} source={accountType === 'kitsu' ? kitsuLogo : aozoraLogo} />
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

  render() {
    const { navigate } = this.props.navigation;
    const { selectedAccount } = this.state;
    const { accounts } = this.props;
    if (!accounts) {
      return <View />;
    }
    const { aozora, kitsu } = accounts;
    return (
      <View style={commonStyles.container}>
        <View style={commonStyles.contentWrapper}>
          <Text style={commonStyles.tutorialText}>
            Oh, you already have a Kitsu account!{'\n'}
            Which do you want to keep?
          </Text>
          <AccountView
            style={{ marginTop: 16 }}
            selected={selectedAccount === 'aozora'}
            onSelectAccount={this.onSelectAccount}
            data={{
              username: aozora.name,
              profileImageURL: aozora.avatar,
              libraryCount: aozora.library_entries,
              accountType: 'aozora',
            }}
          />
          <AccountView
            selected={selectedAccount === 'kitsu'}
            onSelectAccount={this.onSelectAccount}
            data={{
              username: kitsu.name,
              profileImageURL: kitsu.avatar,
              libraryCount: kitsu.library_entries,
              accountType: 'kitsu',
            }}
          />
          <Text style={styles.ps}>
            Activity feed posts from both accounts will be merged. All other account information
            will be overwritten by the account you select above.
          </Text>
          <Button
            style={{ marginHorizontal: 0, marginTop: 24 }}
            onPress={() => navigate('CreateAccountScreen')}
            title={`Keep ${upperFirst(toLower(selectedAccount))} account`}
            titleStyle={commonStyles.buttonTitleStyle}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { loading, error, conflicts: accounts } = user;
  return { loading, error, accounts };
};
export default connect(mapStateToProps, null)(SelectAccountScreen);
