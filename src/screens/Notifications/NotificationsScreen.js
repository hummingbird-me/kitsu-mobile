import React, { PureComponent } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
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
import * as colors from 'kitsu/constants/colors';
import store from 'kitsu/store/config';
import * as types from 'kitsu/store/types';
import { styles } from './styles';
import { isEqual } from 'lodash';

const DOUBLE_PRESS_DELAY = 500;

const CustomHeader = ({ unreadCount, markingRead, onMarkAll }) => (
  <View style={styles.customHeaderWrapper}>
    <Text style={styles.customHeaderText}>Notifications</Text>
    {unreadCount > 0 && (
      <TouchableOpacity activeOpacity={0.8} onPress={onMarkAll} style={styles.customHeaderButton}>
        {markingRead ? (
          <ActivityIndicator color={colors.offBlack} />
        ) : (
          <Text style={styles.customHeaderButtonText}>Mark all as read</Text>
        )}
      </TouchableOpacity>
    )}
  </View>
);

CustomHeader.propTypes = {
  unreadCount: PropTypes.number.isRequired,
  markingRead: PropTypes.bool.isRequired,
  onMarkAll: PropTypes.func.isRequired,
};

const isMentioned = (arr, id) => arr.includes(id);

class NotificationsScreen extends PureComponent {
  state = {
    unreadCount: 0,
  };

  componentWillMount() {
    // Register all global app events here
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.addEventListener('registered', this.onPNRegistered);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
  }

  componentDidMount = () => {
    // for once, and listener will invoke afterwards.
    OneSignal.requestPermissions({ alert: true, sound: true, badge: true });
    this.fetchNotifications();
  };

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
    this.updateNotificationCount();
  }

  onOpened = (openResult) => {
    console.group('Opened Notification');
    console.log('Notification', openResult.notification);
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    console.groupEnd();

    // Show notification tab
    // TODO: Need a way to make sure that users who are not logged in don't get notifications
    Navigation.mergeOptions(Screens.BOTTOM_TABS, {
      bottomTabs: {
        currentTabId: Screens.NOTIFICATION,
      },
    });
  }

  /**
   * Marks all notifications as read, currently triggered from CustomHeader.
   *
   * @memberof NotificationsScreen
   */
  onMarkAll = async () => {
    await this.props.markAllNotificationsAsRead();
    this.updateNotificationCount();
  };

  /**
   * Navigates to related screen on user row item press
   *
   * @param {Object} activity Activity of notification row data
   * @memberof NotificationsScreen
   */
  onNotificationPressed = async ({ activity, notification }) => {
    const { target, verb, actor } = activity;
    const { currentUser, componentId } = this.props;
    this.markNotifications([notification], 'read');
    switch (verb) {
      case 'follow':
        Navigation.push(componentId, {
          component: {
            name: Screens.PROFILE_PAGE,
            passProps: { userId: actor.id || currentUser.id },
          },
        });
        break;
      case 'invited':
        break;
      case 'vote':
        try {
          const response = await this.fetchMediaReactions(target[0].id);
          Navigation.push(componentId, {
            component: {
              name: Screens.MEDIA_PAGE,
              passProps: {
                mediaId: (response.anime && response.anime.id) || (response.manga && response.manga.id),
                mediaType: response.anime ? 'anime' : 'manga',
              },
            },
          });
        } catch (e) {
          console.log(e);
        }
        break;
      case 'post':
        if (target.length !== 0) {
          Navigation.push(componentId, {
            component: {
              name: Screens.FEED_POST_DETAILS,
              passProps: {
                post: target[0],
                comments: [],
                like: null,
                currentUser,
              },
            },
          });
        } else { // should be a "mention"
          const post = await this.fetchPost(activity);
          if (post) {
            Navigation.push(componentId, {
              component: {
                name: Screens.FEED_POST_DETAILS,
                passProps: {
                  post,
                  comments: [],
                  like: null,
                  currentUser,
                },
              },
            });
          }
        }
        break;
      case 'post_like':
      case 'comment_like':
      case 'comment':
        if (target.length !== 0) {
          Navigation.push(componentId, {
            component: {
              name: Screens.FEED_POST_DETAILS,
              passProps: {
                post: target[0],
                comments: [],
                like: null,
                currentUser,
              },
            },
          });
        }
        break;
      default:
        break;
    }
  };

  // Offset for fetching more notifications.
  offset = 0;
  // Timer for fetching notifications again (double tap on tab)
  lastTap = null;

  /**
   * Fetches media reaction.
   * @param {number} mediaId Media ID of notification target ID.
   * @memberof NotificationsScreen
   */
  // TODO: temporary request to fetch mediareactions & to navigate corresponding
  // media screen. (since we don't have mediareactions screen right now)
  fetchMediaReactions = async mediaId =>
    Kitsu.find('mediaReactions', mediaId, {
      include: 'user,anime,manga',
    });

  /**
   * Fetches post by extracting postId from activity foreignId.
   * Created for fetching mentions in a hacky way.
   * @param {object} activity Activity object from notifications
   * @returns {object} post
   * @memberof NotificationsScreen
   */
  fetchPost = async (activity) => {
    if (!activity.foreignId) return null;
    const postId = activity.foreignId.split(':')[1];
    let post;
    try {
      post = await Kitsu.find('posts', postId, {
        include: 'user,targetUser,targetGroup,media,uploads',
      });
    } catch (e) {
      console.log(e);
    }
    return post;
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
    await this.props.markNotifications(notificatios, type);
    this.updateNotificationCount();
  }

  updateNotificationCount = (props = this.props) => {
    const { notifications } = props;
    const unreadCount = notifications.reduce((count, notification) => count + ((notification && notification.isRead) ? 0 : 1), 0);
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

  renderText = (activities) => {
    const { currentUser: { id } } = this.props;
    return <Text>{parseNotificationData(activities, id).text}</Text>;
  };

  renderItem = ({ item }) => {
    const activity = item.activities[0];
    let others = null;
    if (item.activities.length > 1) {
      others =
        item.activities.length === 2 ? (
          <Text style={{ color: '#333', fontWeight: '500' }}>
            {item.activities[1].actor ? item.activities[1].actor.name : 'Unknown'}{' '}
          </Text>
        ) : (
          <Text>{item.activities.length - 1} others </Text>
        );
    }
    const ava =
      activity.actor && activity.actor.avatar
        ? activity.actor.avatar.tiny
        : 'https://staging.kitsu.io/images/default_avatar-ff0fd0e960e61855f9fc4a2c5d994379.png';

    return (
      <TouchableOpacity
        onPress={() => this.onNotificationPressed({ notification: item, activity })}
      >
        <View style={[styles.parentItem, { opacity: item.isRead ? 0.7 : 1 }]}>
          <View style={styles.iconContainer}>
            <Icon name="circle" style={[styles.icon, !item.isRead && styles.iconUnread]} />
          </View>
          <View style={styles.detailsContainer}>
            <View style={{ paddingRight: 10 }}>
              <FastImage style={styles.userAvatar} source={{ uri: ava }} cache="web" />
            </View>
            <View style={styles.activityContainer}>
              <View style={styles.activityTextContainer}>
                <Text style={[styles.activityText, styles.activityTextHighlight]}>
                  {activity.actor && activity.actor.name}{' '}
                </Text>
                <Text style={styles.activityText}>
                  {others && <Text>and {others}</Text>}
                  {this.renderText(item.activities)}
                </Text>
              </View>
              <View style={styles.activityMetaContainer}>
                <Text style={styles.activityMetaText}>{moment(activity.time).fromNow()}</Text>
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
    const { unreadCount } = this.state;
    return (
      <View style={styles.container}>
        <CustomHeader
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
          refreshing={loadingNotifications}
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

NotificationsScreen.propTypes = {
  fetchNotifications: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired,
  loadingNotifications: PropTypes.bool.isRequired,
  markNotifications: PropTypes.func.isRequired,
  markAllNotificationsAsRead: PropTypes.func.isRequired,
  markingRead: PropTypes.bool.isRequired,
  pushNotificationEnabled: PropTypes.bool.isRequired,
};

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

/**
 * Parses notification data into usable objects.
 * Used in in-app notification modal and notification screen render
 *
 * @param {object} activities notification data received from API
 * @param {number} currentUserId logged in user ID
 * @returns {object} notificationData
 *  - {string} notificationData.actorName notification actor name
 *  - {string} notificationData.actorAvatar notification actor avatar URL
 *  - {string} notificationData.text notification text (ex: mentioned you.)
 *  - {string} notificationData.others other users involved in notification
 */
export const parseNotificationData = (activities, currentUserId) => {
  const notificationData = {
    actorName: null,
    actorAvatar: null,
    text: '',
    others: null,
  };

  const activity = activities[0];
  const { replyToType, replyToUser, mentionedUsers, target, subject, actor } = activity;

  // actor
  notificationData.actorName = (actor && actor.name && `${actor.name} `) || '-';

  notificationData.actorAvatar = actor && actor.avatar && actor.avatar.tiny
      ? actor.avatar.tiny
      : 'https://staging.kitsu.io/images/default_avatar-ff0fd0e960e61855f9fc4a2c5d994379.png';

  // others
  if (activities.length > 1) {
    notificationData.others =
      activities.length === 2
        ? activities[1].actor ? activities[1].actor.name : 'Unknown '
        : `${activities.length - 1} others`;
  }

  // text
  switch (activity.verb) {
    case 'follow':
      notificationData.text = 'followed you.';
      break;
    case 'post':
      notificationData.text = 'mentioned you in a post.';
      break;
    case 'post_like':
      notificationData.text = 'liked your post.';
      break;
    case 'comment_like':
      notificationData.text = 'liked your comment.';
      break;
    case 'invited':
      notificationData.text = 'invited you to a group.';
      break;
    case 'vote':
      notificationData.text = 'liked your reaction.';
      break;
    case 'aired':
      const isAnime = actor && actor.type === 'anime';
      const type = isAnime ? 'Episode' : 'Chapter';
      const state = isAnime ? 'aired' : 'released';
      notificationData.actorName = type;
      notificationData.actorAvatar = actor && actor.posterImage && actor.posterImage.tiny ||
        notificationData.actorAvatar; // Fallback to default avatar
      if (subject && subject.number > 0) {
        notificationData.text = `${subject.number} of ${actor.canonicalTitle} ${state}`;
      } else { // No `Episode` or `Chapter` relationship exists...
        notificationData.text = `${actor.canonicalTitle} ${state} a new ${type}`;
      }
      break;
    case 'comment':
      if (replyToUser && currentUserId === replyToUser.split(':')[1]) {
        notificationData.text = `replied to your ${replyToType}.`;
      } else if (isMentioned(mentionedUsers || [], currentUserId)) {
        notificationData.text = 'mentioned you in a comment.';
      } else {
        notificationData.text = 'replied to';
        if (target && target[0] && target[0].user) {
          if (actor && target[0].user.id === actor.id) {
            notificationData.text = `${notificationData.text} their`;
          } else if (target[0].user.id === currentUserId) {
            notificationData.text = `${notificationData.text} your`;
          } else {
            notificationData.text = `${notificationData.text} a`;
          }
        } else {
          notificationData.text = `${notificationData.text} a`;
        }
        notificationData.text = `${notificationData.text} post.`;
      }
      break;
    default:
      notificationData.text = 'made an action.';
      break;
  }

  return notificationData;
};
