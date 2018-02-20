import React from 'react';
import { View, Text } from 'react-native';
import { completeOnboarding } from 'kitsu/store/onboarding/actions';
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
    if (selectedAccount === 'aozora' || hasRatedAnimes) {
      return 'Start building manga library';
    }
    return 'Start building your library';
  }
  if (selectedAccount === 'aozora' || (selectedAccount === 'kitsu' && hasRatedAnimes)) {
    return 'Skip for now';
  }
  return 'Import MyAnimelist or Anilist account';
};

const onPress = (navigation, selectedAccount, hasRatedAnimes, buttonIndex, _completeOnboarding) => {
  if (buttonIndex === 0) {
    if (selectedAccount === 'aozora') {
      navigation.navigate('RateScreen', { type: 'manga', selectedAccount, hasRatedAnimes: true });
    } else if (hasRatedAnimes) {
      navigation.navigate('RateScreen', { type: 'manga', selectedAccount, hasRatedAnimes: true });
    } else {
      navigation.navigate('RateScreen', { type: 'anime', selectedAccount, hasRatedAnimes: false });
    }
  } else if (selectedAccount === 'aozora' || (selectedAccount === 'kitsu' && hasRatedAnimes)) {
    _completeOnboarding();
  } else {
    navigation.navigate('ImportLibrary');
  }
};

class ManageLibrary extends React.Component {
  static navigationOptions = {
    backEnabled: true,
  };

  completeOnboarding = () => {
    this.props.completeOnboarding(this.props.navigation);
  };

  render() {
    const { navigation, selectedAccount, accounts } = this.props;
    const { hasRatedAnimes } = navigation.state.params;

    const kitsuAccountHasEntries = (
      accounts && accounts.kitsu && accounts.kitsu.library_entries >= 5
    );

    const ratedAnime = hasRatedAnimes || kitsuAccountHasEntries;

    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text style={[styles.tutorialText, styles.tutorialText]}>
            {getTitle(selectedAccount, ratedAnime)}
          </Text>
          <Button
            style={[styles.button, { marginTop: 24 }]}
            onPress={() =>
              onPress(navigation, selectedAccount, ratedAnime, 0, this.completeOnboarding)}
            title={getButtonTitle(selectedAccount, ratedAnime, 0)}
            titleStyle={styles.buttonTitleStyle}
          />
          <Button
            style={[styles.button, styles.buttonSecondary]}
            onPress={() =>
              onPress(navigation, selectedAccount, ratedAnime, 1, this.completeOnboarding)}
            title={getButtonTitle(selectedAccount, ratedAnime, 1)}
            titleStyle={styles.buttonSecondaryTitle}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ onboarding, user }) => {
  const { conflicts: accounts, selectedAccount } = onboarding;
  const { loading, error } = user;
  return {
    loading,
    error,
    accounts,
    selectedAccount,
  };
};
export default connect(mapStateToProps, { completeOnboarding })(ManageLibrary);
