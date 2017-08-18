import { StackNavigator } from 'react-navigation';
import navigationOptions from './navigationOptions';
import SidebarScreen from '../screens/Sidebar/SidebarScreen';
import SettingsScreen from '../screens/Sidebar/SettingsScreen';
import GeneralSettings from '../screens/Sidebar/GeneralSettings';
import PrivacySettings from '../screens/Sidebar/PrivacySettings';
import Library from '../screens/Sidebar/Library';
import Blocking from '../screens/Sidebar/Blocking';
import LinkedAccounts from '../screens/Sidebar/LinkedAccounts';
import ImportLibrary from '../screens/Sidebar/ImportLibrary';

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
    }
  },
  {
    navigationOptions: navigationOptions(null),
  },
);

export default SidebarStack;
