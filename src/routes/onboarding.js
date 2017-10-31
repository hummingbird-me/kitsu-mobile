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
  RatingSystemScreen,
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
    FavoritesScreen: {
      screen: FavoritesScreen,
    },
    ImportScreen: {
      screen: ImportScreen,
    },
    RatingSystemScreen: {
      screen: RatingSystemScreen,
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
