import * as AppleAuthentication from 'expo-apple-authentication';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Text, { TextWebLink } from '@/components/content/Text';
import TextSeparator from '@/components/content/TextSeparator';
import Button, { SolidButton } from '@/components/controls/Button';
import { OpenSans } from '@/constants/fonts';
import { kitsuPurple, white } from '@/constants/palette';
import { useNavigation } from '@/navigation/Root/Landing/hooks';

import ScrollingPosters from './ScrollingPosters';

const FACEBOOK = {
  normal: '#1877f2',
  active: '#0d5cc4',
  text: white,
};

export default function RegistrationSlide() {
  const intl = useIntl();
  const navigation = useNavigation();

  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={[styles.container, { width }]}>
      <View style={styles.logoPlaceholder} />
      <View style={styles.scrollingPostersContainer}>
        <ScrollingPosters />
      </View>
      <View style={styles.registrationButtonContainer}>
        <Button
          color="green"
          kind="solid"
          onPress={() => navigation.navigate('Auth', { tab: 'sign-up' })}
          style={styles.button}
          text={intl.formatMessage({
            defaultMessage: 'Create an Account',
            description:
              'Intro -> Registration -> Create an Account button text',
          })}
          textStyle={styles.registrationButtonText}
        />
        <Button
          color="kitsu-purple"
          kind="outline"
          style={styles.button}
          onPress={() => navigation.navigate('Auth', { tab: 'sign-in' })}
          text={intl.formatMessage({
            defaultMessage: 'Sign in',
            description: 'Intro -> Registration -> Sign in button text',
          })}
          textStyle={styles.registrationButtonText}
        />
        <TextSeparator text="or" />
        {/* Apple requires us to use THEIR button component */}
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={styles.button}
          onPress={() => console.log('Apple Sign Up')}
        />
        <SolidButton
          style={styles.button}
          color={FACEBOOK}
          textStyle={styles.registrationButtonText}
          faIcon="facebook-official"
          text={intl.formatMessage({
            defaultMessage: 'Sign up with Facebook',
            description:
              'Intro -> Registration -> Sign up with Facebook button text',
          })}
        />
        <Text style={styles.legalese}>
          <FormattedMessage
            defaultMessage="By continuing, you agree to Kitsu's <terms>Terms of Service</terms> and acknowledge you've read our <privacy>Privacy Policy</privacy>."
            values={{
              terms: (text) => (
                <TextWebLink url="https://kitsu.app/terms">{text}</TextWebLink>
              ),
              privacy: (text) => (
                <TextWebLink url="https://kitsu.app/privacy">
                  {text}
                </TextWebLink>
              ),
            }}
          />
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'column', flex: 1 },
  logoPlaceholder: {
    flex: 1,
  },
  registrationButtonContainer: {
    flex: 3,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingHorizontal: 18,
    paddingTop: 27,
    gap: 10,
  },
  registrationButtonText: {
    fontSize: 18,
    fontFamily: OpenSans.semibold,
  },
  scrollingPostersContainer: {
    flex: 3,
    justifyContent: 'center',
  },
  button: { width: '100%', height: 54, padding: 0 },
  legalese: {
    color: kitsuPurple[2],
    textAlign: 'center',
  },
});
