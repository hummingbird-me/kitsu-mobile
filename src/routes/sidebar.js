import { StackNavigator } from 'react-navigation';
import navigationOptions from './navigationOptions';
import SidebarScreen from '../screens/Sidebar/SidebarScreen';
import SettingsScreen from '../screens/Sidebar/SettingsScreen';

const SidebarStack = StackNavigator(
  {
    Sidebar: {
      screen: SidebarScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    navigationOptions: navigationOptions(null),
  },
);

export default SidebarStack;
