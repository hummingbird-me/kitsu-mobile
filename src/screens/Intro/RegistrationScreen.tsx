import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { kitsuPurple } from '@/constants/palette';
import { Button } from 'kitsu/components/Button';
import * as colors from 'kitsu/constants/colors';

import ScrollingPosters from './ScrollingPosters';
import { IntroHeader } from './common/';

export default function RegistrationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <IntroHeader style={styles.header} />
      <ScrollingPosters style={styles.posters} />
      <View style={styles.buttonsWrapper}>
        <Button
          style={styles.buttonFacebook}
          title={'Sign up with Facebook'}
          icon={'facebook-official'}
        />
        <Button
          style={styles.buttonCreateAccount}
          title={'Create an Account'}
        />
        <Button
          style={styles.buttonAlreadyAccount}
          title={'Already have an account?'}
          titleStyle={{ fontSize: 12, color: colors.lightGrey }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: kitsuPurple[5],
    flex: 1,
  },
  header: {
    flex: 3,
  },
  posters: {
    flex: 0,
  },
  buttonsWrapper: {
    flex: 7,
    justifyContent: 'center',
  },
  buttonFacebook: {
    backgroundColor: colors.fbBlueDark,
  },
  buttonCreateAccount: {
    backgroundColor: colors.transparent,
    borderWidth: 1.5,
    borderColor: colors.darkGrey,
  },
  buttonAlreadyAccount: {
    backgroundColor: colors.transparent,
  },
});
