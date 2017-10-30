import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { iceBackground, iceCube } from 'kitsu/assets/img/onboarding/';
import { styles } from './styles';
import { styles as commonStyles } from '../common/styles';

const WelcomeScreen = ({ navigation }) => (
  <View style={commonStyles.container}>
    <View style={styles.contentWrapper}>
      <Text style={[commonStyles.tutorialText, styles.tutorialText]}>
        Welcome to Kitsu, the new home of the Aozora community. Let{"'"}s break the ice!
      </Text>
      <Image resizeMode="contain" style={styles.iceBackground} source={iceBackground}>
        <Image style={styles.iceCube} source={iceCube} />
      </Image>
      <Text style={[styles.ps, { marginHorizontal: 24, textAlign: 'center' }]}>
        We{"'"}ll walk you through moving your Aozora content over to Kitsu. This will only take a
        minute!
      </Text>
      <Button
        onPress={() => navigation.navigate('SelectAccountScreen')}
        title={"Let's get started!"}
        titleStyle={commonStyles.buttonTitleStyle}
      />
    </View>
  </View>
);

export default WelcomeScreen;
