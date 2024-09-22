import React, { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { SolidButton } from '@/components/controls/Button';
import { ControlledPasswordInput as PasswordInput } from '@/components/controls/PasswordInput';
import { ControlledTextInput as TextInput } from '@/components/controls/TextInput';
import { SessionContext } from '@/contexts/SessionContext';
import InvariantViolated from '@/errors/InvariantViolated';
import { type LandingNavigatorScreenProps } from '@/navigation/Root/Landing/LandingNavigator';
import { useNavigation } from '@/navigation/Root/hooks';
import loginWithPassword from '@/utils/login/withPassword';

import AuthWrapper from './AuthWrapper';
import TabBar from './TabBar';
import styles from './styles';

export type AuthScreenProps =
  | {
      tab: 'sign-in';
      email?: string;
    }
  | {
      tab: 'sign-up';
      email?: string;
      facebookId?: string;
    }
  | {
      tab: 'reset-password';
      email?: string;
    };

// @TODO: Animate, add registration and reset password
export default function AuthScreen({
  route,
}: LandingNavigatorScreenProps<'Auth'>) {
  const session = useContext(SessionContext);
  const navigation = useNavigation();
  if (!session) throw new InvariantViolated('SessionContext is null');

  const form = useForm({
    defaultValues: {
      email: route.params.email ?? '',
      username: '',
      password: '',
      passwordConfirm: '',
    },
  });

  return (
    <View style={styles.container}>
      <AuthWrapper>
        <View>
          <TabBar current={route.params.tab} email={form.watch('email')} />
          <View style={styles.formsWrapper}>
            <FormProvider {...form}>
              <TextInput
                importantForAutofill="yes"
                name="email"
                placeholder="Email"
                keyboardType="email-address"
                autoComplete="email"
                returnKeyType="next"
                enablesReturnKeyAutomatically
              />
              <PasswordInput
                importantForAutofill="yes"
                name="password"
                autoComplete="current-password"
                placeholder="Password"
                returnKeyType="done"
                enablesReturnKeyAutomatically
              />
              {route.params.tab === 'sign-up' ? (
                <TextInput
                  name="passwordConfirm"
                  placeholder="Confirm Password"
                />
              ) : null}
              <SolidButton
                text="Continue"
                color="green"
                onPress={() =>
                  form.handleSubmit(async (values) => {
                    session.setSession(
                      await loginWithPassword({
                        username: values.email,
                        password: values.password,
                      })
                    );
                    navigation.replace('Main');
                  })()
                }
              />
            </FormProvider>
          </View>
        </View>
      </AuthWrapper>
    </View>
  );
}
