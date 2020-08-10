import React, { useState, useRef, useContext } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Animated,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { IntroNavigatorParamList } from 'app/navigation/Intro';
import * as colors from 'app/constants/colors';
import Button from 'app/components/Button';
import Input from 'app/components/Input';
import PasswordInput from 'app/components/PasswordInput';
import FacebookButton from 'app/components/Auth/Facebook';
import loginWithPassword from 'app/actions/loginWithPassword';
import { SessionContext } from 'app/contexts/SessionContext';
import * as SessionStore from 'app/utils/session-store';
import AuthWrapper from './AuthWrapper';
import styles from './styles';

export default function AuthScreen({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<IntroNavigatorParamList, 'Auth'>;
  route: RouteProp<IntroNavigatorParamList, 'Auth'>;
}) {
  const tab = route.params.tab;
  const tabAnim = useRef(new Animated.Value(tab === 'sign-in' ? 0 : 1)).current;
  const setTab = (tab: 'sign-in' | 'sign-up') => {
    const toValue = tab === 'sign-in' ? 0 : 1;
    Animated.timing(tabAnim, {
      useNativeDriver: false,
      toValue,
      duration: 300,
    }).start();
    return navigation.setParams({ tab });
  };
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const usernameInput = useRef<TextInput>(null);
  const passwordInput = useRef<TextInput>(null);
  const confirmPasswordInput = useRef<TextInput>(null);
  const afterEmail = tab === 'sign-up' ? usernameInput : passwordInput;
  const afterPassword = tab === 'sign-up' ? confirmPasswordInput : null;

  const { setSession } = useContext(SessionContext);
  const onSubmit =
    tab === 'sign-up'
      ? () => {}
      : async () => {
          const session = await loginWithPassword({
            username: email,
            password,
          });
          await SessionStore.save(session);
          setSession(session);
          navigation.navigate('ProfileDrawer');
        };

  return (
    <View style={styles.container}>
      <AuthWrapper>
        <View>
          <View style={styles.tabsWrapper}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.tab}
              onPress={() => setTab('sign-up')}>
              <Text
                style={[
                  styles.tabTitle,
                  tab === 'sign-up' ? { color: colors.tabRed } : {},
                ]}>
                Sign up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.tab}
              onPress={() => setTab('sign-in')}>
              <Text
                style={[
                  styles.tabTitle,
                  tab === 'sign-in' ? { color: colors.tabRed } : {},
                ]}>
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formsWrapper}>
            <View>
              <Input
                placeholder="Email"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                keyboardType="email-address"
                autoCompleteType="email"
                onChangeText={(text) => setEmail(text)}
                returnKeyType="next"
                onSubmitEditing={() => afterEmail.current?.focus()}
                blurOnSubmit={false}
              />
              <Animated.View
                style={{
                  height: Animated.multiply(tabAnim, 55),
                  opacity: tabAnim,
                  overflow: 'hidden',
                }}>
                <Input
                  placeholder="Username"
                  autoCapitalize="words"
                  autoCompleteType="username"
                  value={username}
                  onChangeText={(text) => setUsername(text)}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInput.current?.focus()}
                  ref={usernameInput}
                  blurOnSubmit={false}
                />
              </Animated.View>
              <PasswordInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                returnKeyType={tab === 'sign-up' ? 'next' : 'done'}
                onSubmitEditing={() => afterPassword?.current?.focus()}
                ref={passwordInput}
                blurOnSubmit={tab === 'sign-up' ? false : true}
              />
              <Animated.View
                style={{
                  height: Animated.multiply(tabAnim, 55),
                  opacity: tabAnim,
                  overflow: 'hidden',
                }}>
                <PasswordInput
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                  ref={confirmPasswordInput}
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </Animated.View>
              <Button kind="green" onPress={onSubmit} style={{ marginTop: 10 }}>
                {tab === 'sign-up' ? 'Create an account' : 'Sign in'}
              </Button>
              <FacebookButton />
            </View>
          </View>
        </View>
      </AuthWrapper>
    </View>
  );
}
