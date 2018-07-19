import {
  SidebarScreen,
  SettingsScreen,
  GeneralSettings,
  PrivacySettings,
  LibrarySettings,
  Blocking,
  LinkedAccounts,
  ImportLibrary,
  ImportDetail,
  ExportLibrary,
  CannyBoard,
  AppSettings,
  ProScreen
} from 'kitsu/screens/Sidebar';

import * as Screens from 'kitsu/navigation/types';

export default sidebarRoutes = {
  [Screens.SIDEBAR]: SidebarScreen,
  [Screens.SIDEBAR_SETTINGS]: SettingsScreen,
  [Screens.SIDEBAR_SETTINGS_GENERAL]: GeneralSettings,
  [Screens.SIDEBAR_SETTINGS_APP]: AppSettings,
  [Screens.SIDEBAR_SETTINGS_LIBRARY]: LibrarySettings,
  [Screens.SIDEBAR_SETTINGS_PRIVACY]: PrivacySettings,
  [Screens.SIDEBAR_BLOCKING]: Blocking,
  [Screens.SIDEBAR_LINKED_ACCOUNTS]: LinkedAccounts,
  [Screens.SIDEBAR_EXPORT_LIBRARY]: ExportLibrary,
  [Screens.SIDEBAR_IMPORT_LIBRARY]: ImportLibrary,
  [Screens.SIDEBAR_IMPORT_DETAIL]: ImportDetail,
  [Screens.SIDEBAR_CANNY_BOARD]: CannyBoard,
  [Screens.SIDEBAR_KITSU_PRO]: ProScreen,
};
