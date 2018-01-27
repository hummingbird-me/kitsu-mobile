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
import ProfilePages from 'kitsu/screens/Profiles/ProfilePages';
import * as ProfileScreens from 'kitsu/screens/Profiles';
import { SidebarHeader } from 'kitsu/screens/Sidebar/common/';
import MediaPages from 'kitsu/screens/Profiles/MediaPages';
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
    MediaPages: {
      screen: MediaPages,
    },
    ProfilePages: {
      screen: ProfilePages,
    },
    UserLibraryScreen: {
      screen: ProfileScreens.UserLibraryScreen,
    },
    UserLibraryEdit: {
      screen: ProfileScreens.UserLibraryEditScreen,
    },
    UserLibraryList: {
      screen: ProfileScreens.UserLibraryListScreen,
    },
    UserLibrarySearch: {
      screen: ProfileScreens.UserLibrarySearchScreen,
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
      header: ({ getScreenDetails, scene }) => {
        if (navigation.state.routeName === 'UserProfile') {
          return null;
        }
        return (
          <SidebarHeader
            navigation={navigation}
            headerTitle={getScreenDetails(scene).options.title}
          />
        );
      },
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => (
        <Image source={sidebar} style={{ tintColor, width: 21, height: 21 }} />
      ),
    }),
  },
);

export default SidebarStack;
