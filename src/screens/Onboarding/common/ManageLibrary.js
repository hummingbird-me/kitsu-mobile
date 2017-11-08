import React from 'react';
import { View, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Button } from 'kitsu/components/Button';
import { styles } from './styles';

const getTitle = (navigation) => {
  const { account, origin } = navigation.state.params;
  if (account === 'aozora') {
    return 'Kitsu supports manga tracking! Ready to keep track of the manga you’ve read?';
  } else if (origin) {
    return 'Fine taste in anime! Do you want to start your manga library as well?';
  }
  return 'Libraries are how we keep track of what we’ve seen and read. Let’s start yours!';
};

const getButtonTitle = (navigation, buttonIndex) => {
  const { account, origin } = navigation.state.params;
  if (buttonIndex === 0) {
    if (account === 'aozora') {
      return 'Start building manga library';
    }
    return 'Start building your library';
  }
  if (account === 'aozora' || (account === 'kitsu' && origin)) {
    return 'Skip for now';
  }
  return 'Import Myanimelist or Anilist account';
};

const onPress = (navigation, buttonIndex) => {
  const { account, origin } = navigation.state.params;
  if (buttonIndex === 0) {
    if (account === 'aozora') {
      navigation.navigate('RateScreen', { type: 'manga', account });
    } else if (origin) {
      navigation.navigate('RateScreen', { type: 'manga', account });
    } else {
      navigation.navigate('RateScreen', { type: 'anime', account });
    }
  } else if (account === 'aozora' || (account === 'kitsu' && origin)) {
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
    const { navigation, accounts } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text style={[styles.tutorialText, styles.tutorialText]}>{getTitle(navigation)}</Text>
          <Button
            style={{ marginTop: 24 }}
            onPress={() => onPress(navigation, 0)}
            title={getButtonTitle(navigation, 0)}
            titleStyle={styles.buttonTitleStyle}
          />
          <Button
            style={styles.buttonSecondary}
            onPress={() => onPress(navigation, 1)}
            title={getButtonTitle(navigation, 1)}
            titleStyle={styles.buttonSecondaryTitle}
          />
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
export default connect(mapStateToProps, null)(ManageLibrary);
