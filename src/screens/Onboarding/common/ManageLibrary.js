import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { connect } from 'react-redux';
import { styles } from './styles';

const getTitle = account =>
  (account === 'aozora'
    ? 'Kitsu supports manga tracking! Ready to keep track of the manga you’ve read?'
    : 'Libraries are how we keep track of what   we’ve seen and read. Let’s start yours!');

const getButtonTitle = (account, buttonIndex) => {
  if (buttonIndex === 0) {
    if (account === 'aozora') {
      return 'Start building manga library';
    }
    return 'Start building your library';
  }
  if (account === 'aozora') {
    return 'Skip for now';
  }
  return 'Import Myanimelist or Anilist account';
};

const onPress = (navigation, buttonIndex) => {
  const account = navigation.state.params.account;
  if (buttonIndex === 0) {
    if (account === 'aozora') {
      navigation.navigate('');
    }
    navigation.navigate('RateScreen');
  } else {
    if (account === 'aozora') {
      navigation.navigate('');
    }

    navigation.navigate('');
  }
};

const ManageLibrary = ({ navigation, accounts }) => (
  <View style={styles.container}>
    <View style={styles.contentWrapper}>
      <Text style={[styles.tutorialText, styles.tutorialText]}>
        {getTitle(navigation.state.params.account)}
      </Text>
      <Button
        style={{ marginTop: 24 }}
        onPress={() => onPress(navigation, 0)}
        title={getButtonTitle(navigation.state.params.account, 0)}
        titleStyle={styles.buttonTitleStyle}
      />
      <Button
        style={styles.buttonSecondary}
        onPress={() => onPress(navigation, 1)}
        title={getButtonTitle(navigation.state.params.account, 1)}
        titleStyle={styles.buttonSecondaryTitle}
      />
    </View>
  </View>
);

const mapStateToProps = ({ user }) => {
  const { loading, error, conflicts: accounts } = user;
  return { loading, error, accounts };
};
export default connect(mapStateToProps, null)(ManageLibrary);
