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
} from 'kitsu/screens/Sidebar';

export const sidebarRoutes = {
  Settings: {
    screen: SettingsScreen,
  },
  GeneralSettings: {
    screen: GeneralSettings,
  },
  PrivacySettings: {
    screen: PrivacySettings,
  },
  LibrarySettings: {
    screen: LibraryScreen,
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
};
