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
import Tabs from './tabs';

const OnboardingStack = StackNavigator(
  {
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
    Tabs: {
      screen: Tabs,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      ...navigationOptions(null),
      header: ({ getScreenDetails, scene }) => {
        console.log(navigation.state, scene);
        const { backEnabled } = getScreenDetails(scene).options;
        const { params } = navigation.state;
        if (navigation.state.routeName === 'Tabs') return null;
        return (
          <OnboardingHeader
            navigation={navigation}
            backEnabled={backEnabled}
            buttonRightText={params && params.buttonRightText}
            buttonRightEnabled={params && params.buttonRightEnabled}
            buttonRightOnPress={params && params.buttonRightOnPress}
          />
        );
      },
    }),
  },
);

export default OnboardingStack;
