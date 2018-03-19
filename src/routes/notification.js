import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import { StackNavigator } from 'react-navigation';
import NotificationsScreen from 'kitsu/screens/Notifications/NotificationsScreen';
import notificationIcon from 'kitsu/assets/img/tabbar_icons/notification.png';
import * as colors from 'kitsu/constants/colors';
import { commonRoutes } from './common';
import navigationOptions from './navigationOptions';

const NotifStack = StackNavigator(
  {
    Notifications: {
      screen: NotificationsScreen,
    },
    ...commonRoutes,
  },
  {
    navigationOptions: ({ screenProps }) => ({
      ...navigationOptions(
        Platform.select({ ios: 64, android: 74 }),
        Platform.select({ ios: 0, android: 20 }),
        {
          shadowOpacity: 0,
        },
      ),
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => {
        const shouldExpand = screenProps.badge > 99;
        return (
          <View style={[
            styles.tabBarIconWrapper, shouldExpand && styles.tabBarIconWrapperExpanded]}
          >
            {screenProps &&
              screenProps.badge > 0 && (
                <View style={[
                  styles.textWrapper,
                  shouldExpand && styles.textWrapperExpanded]}
                >
                  <Text style={styles.text}>
                    {shouldExpand ? '99+' : screenProps.badge}
                  </Text>
                </View>
              )}
            <FastImage source={notificationIcon} style={[styles.tabBarIcon, { tintColor }]} />
          </View>
        );
      },
    }),
  },
);

const styles = StyleSheet.create({
  textWrapper: {
    position: 'absolute',
    top: -7,
    left: 12,
    backgroundColor: colors.red,
    padding: 3,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    minWidth: 16,
  },
  textWrapperExpanded: {
    minWidth: 22,
  },
  text: {
    color: colors.white,
    minWidth: 14,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'OpenSans',
  },
  tabBarIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 21,
    height: 21,
  },
  tabBarIconWrapperExpanded: {
    width: 25,
  },
  tabBarIcon: {
    width: 21,
    height: 21,
  },
});

export default NotifStack;
