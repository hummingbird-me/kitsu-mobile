import React from 'react';
import { View, Text } from 'react-native';
import { completeOnboarding } from 'app/store/onboarding/actions';
import { connect } from 'react-redux';
import { Button } from 'app/components/Button';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'app/navigation';
import { styles } from './styles';
import { OnboardingHeader } from './OnboardingHeader/component';

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

const onPress = (componentId, selectedAccount, hasRatedAnimes, buttonIndex, _completeOnboarding) => {
  if (buttonIndex === 0) {
    if (selectedAccount === 'aozora') {
      Navigation.push(componentId, {
        component: {
          name: Screens.ONBOARDING_RATE_SCREEN,
          passProps: { type: 'manga', selectedAccount, hasRatedAnimes: true },
        },
      });
    } else if (hasRatedAnimes) {
      Navigation.push(componentId, {
        component: {
          name: Screens.ONBOARDING_RATE_SCREEN,
          passProps: { type: 'manga', selectedAccount, hasRatedAnimes: true },
        },
      });
    } else {
      Navigation.push(componentId, {
        component: {
          name: Screens.ONBOARDING_RATE_SCREEN,
          passProps: { type: 'anime', selectedAccount, hasRatedAnimes: false },
        },
      });
    }
  } else if (selectedAccount === 'aozora' || (selectedAccount === 'kitsu' && hasRatedAnimes)) {
    _completeOnboarding();
  } else {
    Navigation.push(componentId, {
      component: {
        name: Screens.ONBOARDING_IMPORT_LIBRARY,
      },
    });
  }
};

class ManageLibrary extends React.Component {
  completeOnboarding = () => {
    this.props.completeOnboarding();
  };

  render() {
    const { componentId, selectedAccount, accounts, hasRatedAnimes } = this.props;

    const kitsuAccountHasEntries = (
      accounts && accounts.kitsu && accounts.kitsu.library_entries >= 5
    );

    const ratedAnime = hasRatedAnimes || kitsuAccountHasEntries;

    return (
      <View style={styles.container}>
        <OnboardingHeader
          componentId={componentId}
          backEnabled
        />
        <View style={styles.contentWrapper}>
          <Text style={[styles.tutorialText, styles.tutorialText]}>
            {getTitle(selectedAccount, ratedAnime)}
          </Text>
          <Button
            style={[styles.button, { marginTop: 24 }]}
            onPress={() =>
              onPress(componentId, selectedAccount, ratedAnime, 0, this.completeOnboarding)}
            title={getButtonTitle(selectedAccount, ratedAnime, 0)}
            titleStyle={styles.buttonTitleStyle}
          />
          <Button
            style={[styles.button, styles.buttonSecondary]}
            onPress={() =>
              onPress(componentId, selectedAccount, ratedAnime, 1, this.completeOnboarding)}
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
