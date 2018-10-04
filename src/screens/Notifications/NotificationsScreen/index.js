import React, { PureComponent } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  PushNotificationIOS,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import OneSignal from 'react-native-onesignal';
import moment from 'moment';
import { Kitsu } from 'kitsu/config/api';
import {
  fetchNotifications,
  markNotifications,
  markAllNotificationsAsRead,
} from 'kitsu/store/feed/actions';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'kitsu/navigation';
import store from 'kitsu/store/config';
import * as types from 'kitsu/store/types';
import { isEqual, isEmpty } from 'lodash';
import { parseNotificationData, handleNotificationPress, handleOneSignalNotificationData } from 'kitsu/utils/notifications';
import { EventBus } from 'kitsu/utils/eventBus';
import { NotificationHeader } from 'kitsu/screens/Notifications/NotificationHeader';
import { styles } from './styles';

export const NOTIFICATION_PRESSED_EVENT = 'notification_pressed_event';

// Fetch notifications every 3 minutes
export const NOTIFICATION_FETCH_INTERVAL = 3 * 60 * 1000;

class NotificationsScreen extends PureComponent {
  static propTypes = {
    fetchNotifications: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
    notifications: PropTypes.array.isRequired,
    loadingNotifications: PropTypes.bool.isRequired,
    markNotifications: PropTypes.func.isRequired,
    markAllNotificationsAsRead: PropTypes.func.isRequired,
    markingRead: PropTypes.bool.isRequired,
    pushNotificationEnabled: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  state = {
    unreadCount: 0,
    loadingOneSignalNotification: false,
  };

  componentWillMount() {
    // Register all global app events here
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.addEventListener('registered', this.onPNRegistered);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);

    // Event for handling notification press from `NotificationOverlay`
    this.unsubscribeNotificationPress = EventBus.subscribe(NOTIFICATION_PRESSED_EVENT, (notification) => {
      // Navigate to notification tab
      Navigation.mergeOptions(Screens.BOTTOM_TABS, {
        bottomTabs: {
          // TODO: Change this once RNN fixes currentTabId
          currentTabIndex: 3,
          // currentTabId: Screens.NOTIFICATION,
        },
      });

      this.onNotificationPressed(notification);
    });
  }

  componentDidMount() {
    // for once, and listener will invoke afterwards.
    OneSignal.requestPermissions({ alert: true, sound: true, badge: true });

    // Setup notification intervals
    this.fetchNotifications();
    this.notificationInterval = setInterval(this.fetchNotifications, NOTIFICATION_FETCH_INTERVAL);
  }

  // eslint-disable-next-line
  componentDidAppear() {
    // Everytime user shows notifications tab, clear them
    OneSignal.clearOneSignalNotifications();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.notifications, nextProps.notifications)) {
      this.updateNotificationCount(nextProps);
    }
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIds);
    OneSignal.removeEventListener('registered', this.onPNRegistered);
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    this.unsubscribeNotificationPress();
    clearInterval(this.notificationInterval);
  }

  onIds = (device) => {
    console.log(device.userId);
    store.dispatch({ type: types.ONESIGNAL_ID_RECEIVED, payload: device.userId });
  }

  onPNRegistered = (notificationData) => {
    console.log('device registered', notificationData);
  };

  onReceived = (notification) => {
    console.log('Notification received: ', notification);

    // If we got a notification while user is in the app then dismiss it
    if (notification && notification.isAppInFocus && notification.androidNotificationId) {
      OneSignal.cancelNotification(notification.androidNotificationId);
    }

    this.updateNotificationCount();
  }

  onOpened = async (openResult) => {
    console.group('Opened Notification');
    console.log('Notification', openResult.notification);
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    console.groupEnd();

    const data = openResult.notification.payload.additionalData;
    if (!data) return;

    // Show notification tab
    // TODO: Need a way to make sure that users who are not logged in don't get notifications
    Navigation.mergeOptions(Screens.BOTTOM_TABS, {
      bottomTabs: {
        currentTabId: Screens.NOTIFICATION,
      },
    });

    // Handle the one signal notification
    this.setState({ loadingOneSignalNotification: true });
    await handleOneSignalNotificationData(this.props.componentId, data);
    this.setState({ loadingOneSignalNotification: false });

    // Fetch the actual notification
    this.fetchNotifications();
  }

  /**
   * Marks all notifications as read, currently triggered from NotificationHeader.
   */
  onMarkAll = async () => {
    OneSignal.clearOneSignalNotifications();
    await this.props.markAllNotificationsAsRead();
    this.updateNotificationCount();
  };

  /**
   * Navigates to related screen on user row item press
   *
   * @param {Object} notification The notification row data
   */
  onNotificationPressed = async (notification) => {
    await handleNotificationPress(this.props.componentId, notification);
    this.updateNotificationCount();
  };


  /**
   * Fetches notifications and immediately marks them as read.
   * @memberof NotificationsScreen
   */
  fetchNotifications = async () => {
    const { loadingNotifications } = this.props;

    if (!loadingNotifications) {
      await this.props.fetchNotifications();
      await this.markNotifications(this.props.notifications, 'seen');
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    }
  };

  /**
   * Fetches more notifications and appends them to current state.
   * loadingMoreNotifications flag is for throtling scroll event.
   * @memberof NotificationsScreen
   */
  fetchMoreNotifications = async () => {
    const { loadingMoreNotifications, notifications } = this.props;
    if (!loadingMoreNotifications) {
      await this.props.fetchNotifications(notifications.slice(-1)[0].id);
      this.markNotifications(this.props.notifications, 'seen');
    }
  };

  markNotifications = async (notifications, type) => {
    await this.props.markNotifications(notifications, type);
    this.updateNotificationCount();
  }

  updateNotificationCount = (props = this.props) => {
    const { notifications } = props;
    const unreadCount = notifications.reduce((count, notification) => count + ((notification && !notification.isRead) ? 1 : 0), 0);
    const badge = unreadCount > 0 ? `${unreadCount}` : '';

    // Set the state and the badges
    this.setState({ unreadCount });
    Navigation.mergeOptions(Screens.NOTIFICATION, {
      bottomTab: {
        badge,
      },
    });
  }

  resetScrollPosition = () => {
    this.list.scrollToOffset({ x: 0, y: 0, animated: true });
  }

  handleActionBtnPress = () => {
    if (Platform.OS === 'ios') {
      OneSignal.requestPermissions({ alert: true, sound: true, badge: true });
    }
  };

  renderItem = ({ item }) => {
    const { currentUser: { id } } = this.props;
    const data = parseNotificationData(item.activities, id);
    const activity = item.activities[0];
    const time = (activity && activity.time && moment(activity.time).fromNow()) || '-';

    return (
      <TouchableOpacity
        onPress={() => this.onNotificationPressed(item)}
      >
        <View style={[styles.parentItem, { opacity: item.isRead ? 0.7 : 1 }]}>
          <View style={styles.iconContainer}>
            <Icon name="circle" style={[styles.icon, !item.isRead && styles.iconUnread]} />
          </View>
          <View style={styles.detailsContainer}>
            <View style={{ paddingRight: 10 }}>
              <FastImage style={styles.userAvatar} source={{ uri: data.actorAvatar }} cache="web" />
            </View>
            <View style={styles.activityContainer}>
              <View style={styles.activityTextContainer}>
                <Text style={[styles.activityText, { flex: 1 }]}>
                  <Text style={[styles.activityText, styles.activityTextHighlight]}>
                    {data.actorName}{' '}
                  </Text>
                  {!isEmpty(data.others) && <Text>and {data.others} </Text>}
                  <Text>{data.text}</Text>
                </Text>
              </View>
              <View style={styles.activityMetaContainer}>
                <Text style={styles.activityMetaText}>{time}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderItemSeperator = () => <View style={styles.itemSeperator} />;

  renderHeader = () => {
    if (!this.props.pushNotificationEnabled) {
      return (
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>Kitsu is better with notifications!</Text>
          <TouchableOpacity style={styles.actionButton} onPress={this.handleActionBtnPress}>
            <Text style={styles.actionButtonText}>Turn on notifications</Text>
          </TouchableOpacity>
          <Icon name="close" style={styles.closeIcon} />
        </View>
      );
    }
    return <View />;
  };

  render() {
    const { notifications, loadingNotifications, markingRead } = this.props;
    const { unreadCount, loadingOneSignalNotification } = this.state;
    return (
      <View style={styles.container}>
        <NotificationHeader
          markingRead={markingRead}
          unreadCount={unreadCount}
          onMarkAll={this.onMarkAll}
        />
        <FlatList
          ref={(r) => { this.list = r; }}
          ListHeaderComponent={this.renderHeader}
          data={notifications}
          renderItem={this.renderItem}
          keyExtractor={item => `${item.id}`}
          ItemSeparatorComponent={this.renderItemSeperator}
          initialNumToRender={10}
          refreshing={loadingNotifications || loadingOneSignalNotification}
          onRefresh={this.fetchNotifications}
          onMomentumScrollBegin={() => {
            // Prevent iOS calling onendreached when list is loaded.
            this.onEndReachedCalledDuringMomentum = false;
          }}
          onEndReached={() => {
            if (!this.onEndReachedCalledDuringMomentum) {
              this.fetchMoreNotifications();
              this.onEndReachedCalledDuringMomentum = true;
            }
          }}
          onEndReachedThreshold={0.5}
          style={styles.container}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ feed, user, app }) => {
  const { notifications, loadingNotifications, markingRead } = feed;
  const { currentUser } = user;
  const { pushNotificationEnabled } = app;
  return {
    notifications,
    loadingNotifications,
    currentUser,
    pushNotificationEnabled,
    markingRead,
  };
};
export default connect(mapStateToProps, {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotifications,
})(NotificationsScreen);
