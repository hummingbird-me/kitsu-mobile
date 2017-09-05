import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import NotificationsScreen from 'kitsu/screens/Notifications/NotificationsScreen';
import notificationIcon from 'kitsu/assets/img/tabbar_icons/notification.png';
import * as colors from 'kitsu/constants/colors';
import navigationOptions from './navigationOptions';

const NotifStack = StackNavigator(
  {
    Notifications: {
      screen: NotificationsScreen,
    },
  },
  {
    navigationOptions: ({ screenProps }) => ({
      ...navigationOptions(83),
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => (
        <View>
          {screenProps &&
            screenProps.badge > 0 &&
            <View
              style={styles.textWrapper}
            >
              <Text
                style={styles.text}
              >
                {screenProps.badge}
              </Text>
            </View>}
          <Image source={notificationIcon} style={[styles.tabBarIcon, { tintColor }]} />
        </View>
      ),
    }),
  },
);

const styles = StyleSheet.create({
  textWrapper: {
    position: 'absolute',
    top: -7,
    left: 12,
    backgroundColor: colors.darkPurple,
    padding: 3,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    minWidth: 16,
  },
  text: {
    color: colors.white,
    fontSize: 10,
    minWidth: 14,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'OpenSans',
  },
  tabBarIcon: {
    width: 21,
    height: 21,
  },
});

export default NotifStack;
