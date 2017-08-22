import { StackNavigator } from 'react-navigation';
import SidebarScreen from 'kitsu/screens/Sidebar/SidebarScreen';
import SettingsScreen from 'kitsu/screens/Sidebar/SettingsScreen';
import GeneralSettings from 'kitsu/screens/Sidebar/GeneralSettings';
import PrivacySettings from 'kitsu/screens/Sidebar/PrivacySettings';
import Library from 'kitsu/screens/Sidebar/Library';
import Blocking from 'kitsu/screens/Sidebar/Blocking';
import LinkedAccounts from 'kitsu/screens/Sidebar/LinkedAccounts';
import ImportLibrary from 'kitsu/screens/Sidebar/ImportLibrary';
import ImportDetail from 'kitsu/screens/Sidebar/ImportDetail';
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
  },
  {
    navigationOptions: navigationOptions(null),
  },
);

export default SidebarStack;
