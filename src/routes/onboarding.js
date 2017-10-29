import React from 'react';
import { StackNavigator } from 'react-navigation';
import {
  CreateAccountScreen,
  SelectAccountScreen,
  WelcomeScreen,
  RateScreen,
  OnboardingHeader,
  FavoritesScreen,
  ImportScreen,
  RatingScreen,
} from 'kitsu/screens/Onboarding/';
import navigationOptions from './navigationOptions';

const OnboardingStack = StackNavigator(
  {
    FavoritesScreen: {
      screen: FavoritesScreen,
    },
    WelcomeScreen: {
      screen: WelcomeScreen,
    },
    CreateAccountScreen: {
      screen: CreateAccountScreen,
    },
    SelectAccountScreen: {
      screen: SelectAccountScreen,
    },
    RateScreen: {
      screen: RateScreen,
    },
    OnboardingHeader: {
      screen: OnboardingHeader,
    },

    ImportScreen: {
      screen: ImportScreen,
    },
    RatingScreen: {
      screen: RatingScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      ...navigationOptions(null),
      header: ({ getScreenDetails, scene }) => (
        <OnboardingHeader
          navigation={navigation}
          headerTitle={getScreenDetails(scene).options.title}
        />
      ),
    }),
  },
);

export default OnboardingStack;
