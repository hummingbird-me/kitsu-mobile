import React from 'react';
import { StackNavigator } from 'react-navigation';
import {
  CreateAccountScreen,
  SelectAccountScreen,
  WelcomeScreen,
  RateScreen,
  OnboardingHeader,
  FavoritesScreen,
  ManageLibrary,
  RatingSystemScreen,
  ImportLibrary,
  ImportDetail,
} from 'kitsu/screens/Onboarding/';
import navigationOptions from './navigationOptions';

const OnboardingStack = StackNavigator(
  {
    RateScreen: {
      screen: RateScreen,
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
    ManageLibrary: {
      screen: ManageLibrary,
    },
    ImportLibrary: {
      screen: ImportLibrary,
    },
    ImportDetail: {
      screen: ImportDetail,
    },
    RatingSystemScreen: {
      screen: RatingSystemScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      ...navigationOptions(null),
      header: ({ getScreenDetails, scene }) => {
        const { backEnabled, componentRight } = getScreenDetails(scene).options;
        return (
          <OnboardingHeader
            navigation={navigation}
            backEnabled={backEnabled}
            componentRight={componentRight}
          />
        );
      },
    }),
  },
);

export default OnboardingStack;
