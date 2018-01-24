import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { NavigationActions } from 'react-navigation';
import { iceBackground, iceCube } from 'kitsu/assets/img/onboarding/';
import { connect } from 'react-redux';
import { styles } from './styles';
import { styles as commonStyles } from '../common/styles';

class WelcomeScreen extends React.Component {
  onPress = () => {
    const { screenName, navigation, accounts } = this.props;
    if (screenName === null) {
      if (!accounts) {
        // probably user signup
        navigation.navigate('FavoritesScreen');
      } else if (accounts.kitsu && accounts.aozora) {
        // if there is aozora, we have conflict.
        navigation.navigate('SelectAccountScreen');
      } else {
        navigation.navigate('CreateAccountScreen');
      }
    } else {
      resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: screenName })],
        key: null,
      });
      navigation.dispatch(resetAction);
    }
  };
  render() {
    const { accounts } = this.props;

    const title = !accounts ?
      "Welcome to Kitsu, the home of all things weeb! Let's break the ice!" :
      "Welcome to Kitsu, the new home of the Aozora community. Let's break the ice!";

    const subtitle = !accounts ?
      "We'll walk you through setting up your account. This will only take a minute!" :
      "We'll walk you through moving your Aozora content over to Kitsu. This will only take a minute!";

    return (
      <View style={commonStyles.container}>
        <View style={styles.contentWrapper}>
          <Text style={[commonStyles.tutorialText, styles.tutorialText]}>
            {title}
          </Text>
          <Image resizeMode="contain" style={styles.iceBackground} source={iceBackground}>
            <Image style={styles.iceCube} source={iceCube} />
          </Image>
          <Text style={[styles.ps, { marginHorizontal: 24, textAlign: 'center' }]}>
            {subtitle}
          </Text>
          <Button
            onPress={this.onPress}
            title={"Let's get started!"}
            titleStyle={commonStyles.buttonTitleStyle}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ onboarding, user }) => {
  const { conflicts: accounts, screenName } = onboarding;
  const { loading, error } = user;
  return { loading, error, accounts, screenName };
};
export default connect(mapStateToProps, null)(WelcomeScreen);
