import { StackNavigator } from 'react-navigation';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';

import { darkPurple, white } from '../constants/colors';

const NotifStack = StackNavigator(
  {
    Notifications: {
      screen: NotificationsScreen,
    },
  },
  {
    navigationOptions: {
      headerStyle: { backgroundColor: darkPurple, height: 83 },
      headerTitleStyle: {
        color: white,
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: -10,
      },
    },
  },
);

export default NotifStack;
