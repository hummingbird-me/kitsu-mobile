import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { iceBackground, iceCube } from 'kitsu/assets/img/onboarding/';
import { styles } from './styles';
import { styles as commonStyles } from '../common/styles';

const WelcomeScreen = ({ navigation }) => (
  <View style={commonStyles.container}>
    <View style={commonStyles.contentWrapper}>
      <Text style={commonStyles.tutorialText}>
        Welcome to Kitsu, the new home of the Aozora community. Let{"'"}s break the ice!
      </Text>
      <Image source={iceBackground} />
      <Image source={iceCube} />
      <Button
        style={{ marginHorizontal: 0 }}
        onPress={() => navigation.navigate('SelectAccountScreen')}
        title={"Let's get started!"}
        titleStyle={commonStyles.buttonTitleStyle}
      />
    </View>
  </View>
);

export default WelcomeScreen;
