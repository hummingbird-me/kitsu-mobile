import React from 'react';
import { Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import sidebar from 'kitsu/assets/img/tabbar_icons/sidebar.png';
import {
  SidebarScreen,
  SettingsScreen,
  GeneralSettings,
  PrivacySettings,
  Library,
  Blocking,
  LinkedAccounts,
  ImportLibrary,
  ImportDetail,
} from 'kitsu/screens/Sidebar/';
import { SidebarHeader } from 'kitsu/screens/Sidebar/common/';
import { CannyBoard } from 'kitsu/components/CannyBoard';
import navigationOptions from './navigationOptions';

const SidebarStack = StackNavigator(
  {
    Sidebar: {
      screen: SidebarScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
    GeneralSettings: {
      screen: GeneralSettings,
    },
    PrivacySettings: {
      screen: PrivacySettings,
    },
    Library: {
      screen: Library,
    },
    Blocking: {
      screen: Blocking,
    },
    LinkedAccounts: {
      screen: LinkedAccounts,
    },
    ImportLibrary: {
      screen: ImportLibrary,
    },
    ImportDetail: {
      screen: ImportDetail,
    },
    SuggestFeatures: {
      screen: CannyBoard,
    },
    ReportBugs: {
      screen: CannyBoard,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      ...navigationOptions(null),
      header: ({ getScreenDetails, scene }) => (
        <SidebarHeader
          navigation={navigation}
          headerTitle={getScreenDetails(scene).options.title}
        />
      ),
      tabBarIcon: ({ tintColor }) => (
        <Image source={sidebar} style={{ tintColor, width: 20, height: 21 }} />
      ),
    }),
  },
);

export default SidebarStack;
