import React from 'react';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Button } from 'kitsu/components/Button';
import { styles } from './styles';

const getTitle = (selectedAccount, hasRatedAnimes) => {
  if (selectedAccount === 'aozora') {
    return 'Kitsu supports manga tracking! Ready to keep track of the manga you’ve read?';
  } else if (hasRatedAnimes) {
    return 'Fine taste in anime! Do you want to start your manga library as well?';
  }
  return 'Libraries are how we keep track of what we’ve seen and read. Let’s start yours!';
};

const getButtonTitle = (selectedAccount, hasRatedAnimes, buttonIndex) => {
  if (buttonIndex === 0) {
    if (selectedAccount === 'aozora') {
      return 'Start building manga library';
    }
    return 'Start building your library';
  }
  if (selectedAccount === 'aozora' || (selectedAccount === 'kitsu' && hasRatedAnimes)) {
    return 'Skip for now';
  }
  return 'Import Myanimelist or Anilist account';
};

const onPress = (selectedAccount, hasRatedAnimes, buttonIndex) => {
  if (buttonIndex === 0) {
    if (selectedAccount === 'aozora') {
      navigation.navigate('RateScreen', { type: 'manga', selectedAccount });
    } else if (hasRatedAnimes) {
      navigation.navigate('RateScreen', { type: 'manga', selectedAccount });
    } else {
      navigation.navigate('RateScreen', { type: 'anime', selectedAccount });
    }
  } else if (selectedAccount === 'aozora' || (selectedAccount === 'kitsu' && hasRatedAnimes)) {
    const navigateTabs = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
    });
    navigation.dispatch(navigateTabs);
  } else {
    navigation.navigate('ImportLibrary');
  }
};

class ManageLibrary extends React.Component {
  static navigationOptions = {
    backEnabled: true,
  };

  render() {
    const { navigation, hasRatedAnimes, selectedAccount, accounts } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text style={[styles.tutorialText, styles.tutorialText]}>
            {getTitle(selectedAccount, hasRatedAnimes)}
          </Text>
          <Button
            style={{ marginTop: 24 }}
            onPress={() => onPress(selectedAccount, hasRatedAnimes, 0)}
            title={getButtonTitle(selectedAccount, hasRatedAnimes, 0)}
            titleStyle={styles.buttonTitleStyle}
          />
          <Button
            style={styles.buttonSecondary}
            onPress={() => onPress(selectedAccount, hasRatedAnimes, 1)}
            title={getButtonTitle(selectedAccount, hasRatedAnimes, 1)}
            titleStyle={styles.buttonSecondaryTitle}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ onboarding, user }) => {
  const { conflicts: accounts, hasRatedAnimes, selectedAccount } = onboarding;
  const { loading, error } = user;
  return {
    loading,
    error,
    accounts,
    hasRatedAnimes,
    selectedAccount,
  };
};
export default connect(mapStateToProps, null)(ManageLibrary);
