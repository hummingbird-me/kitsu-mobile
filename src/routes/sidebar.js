import React from 'react';
import { Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import sidebar from 'kitsu/assets/img/tabbar_icons/sidebar.png';
import {
  SidebarScreen,
  SettingsScreen,
  GeneralSettings,
  PrivacySettings,
  LibraryScreen,
  Blocking,
  LinkedAccounts,
  ImportLibrary,
  ImportDetail,
  ExportLibrary,
  CannyBoard,
} from 'kitsu/screens/Sidebar/';
import { UserLibraryScreen } from 'kitsu/screens/Profiles';
import { SidebarHeader } from 'kitsu/screens/Sidebar/common/';
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
      screen: LibraryScreen,
    },
    UserLibraryScreen: {
      screen: UserLibraryScreen,
    },
    Blocking: {
      screen: Blocking,
    },
    LinkedAccounts: {
      screen: LinkedAccounts,
    },
    ExportLibrary: {
      screen: ExportLibrary,
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
    DatabaseRequests: {
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
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => (
        <Image source={sidebar} style={{ tintColor, width: 21, height: 21 }} />
      ),
    }),
  },
);

export default SidebarStack;
