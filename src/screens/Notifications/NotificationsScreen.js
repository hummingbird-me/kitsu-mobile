import React, { PureComponent } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import OneSignal from 'react-native-onesignal';
import moment from 'moment';
import { Kitsu } from 'kitsu/config/api';
import {
  fetchNotifications,
  markNotificationsAsSeen,
  markAllNotificationsAsRead,
} from 'kitsu/store/feed/actions';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

const DOUBLE_PRESS_DELAY = 500;

const CustomHeader = ({ notificationsUnread, markingRead, onMarkAll }) => (
  <View style={styles.customHeaderWrapper}>
    <Text style={styles.customHeaderText}>Notifications</Text>
    {notificationsUnread > 0 && (
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
  notificationsUnread: PropTypes.number.isRequired,
  markingRead: PropTypes.bool.isRequired,
  onMarkAll: PropTypes.func.isRequired,
};

const isMentioned = (arr, id) => arr.includes(id);

class NotificationsScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: 'Notifications',
    header: null,
    tabBarOnPress: navigation.state.params && navigation.state.params.tabListener,
  });

  state = {
    notificationsUnread: false,
  };

  componentDidMount = () => {
    // for once, and listener will invoke afterwards.
    this.fetchNotifications();
    // set a listener for notification tab press.
    // this is required for updating seen of notifications.
    this.props.navigation.setParams({
      tabListener: async ({ previousScene, scene, jumpToIndex }) => {
        // capture tap events and detect double press to fetch notifications
        const now = new Date().getTime();
        const doublePressed = this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY;
        if (previousScene.key !== 'Notifications' || doublePressed) {
          this.lastTap = null;
          jumpToIndex(scene.index);
          this.fetchNotifications();
        } else {
          this.lastTap = now;
        }
      },
    });
  };

  /**
   * Marks all notifications as read, currently triggered from CustomHeader.
   *
   * @memberof NotificationsScreen
   */
  onMarkAll = () => {
    this.props.markAllNotificationsAsRead();
  };

  /**
   * Navigates to related screen on user row item press
   *
   * @param {Object} activity Activity of notification row data
   * @memberof NotificationsScreen
   */
  onNotificationPressed = async (activity) => {
    const { target, verb, actor } = activity;
    const { currentUser, navigation } = this.props;
    switch (verb) {
      case 'follow':
        navigation.navigate('ProfilePages', { userId: actor.id || currentUser.id });
        break;
      case 'invited':
        break;
      case 'vote':
        try {
          const response = await this.fetchMediaReactions(target[0].id);
          navigation.navigate('MediaPages', {
            mediaId: (response.anime && response.anime.id) || (response.manga && response.manga.id),
            mediaType: response.anime ? 'anime' : 'manga',
          });
        } catch (e) {
          console.log(e);
        }
        break;
      case 'post':
      case 'post_like':
      case 'comment_like':
      case 'comment':
        if (target.length !== 0) {
          navigation.navigate('PostDetails', {
            post: target[0],
            comments: [],
            like: null,
            currentUser,
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
   * TODO: temporary request to fetch mediareactions & to navigate corresponding
   * media screen. (since we don't have mediareactions screen right now)
   *
   * @param {number} mediaId Media ID of notification target ID.
   * @memberof NotificationsScreen
   */
  fetchMediaReactions = async mediaId =>
    Kitsu.find('mediaReactions', mediaId, {
      include: 'user,anime,manga',
    });

  /**
   * Fetches notifications and immediately marks them as read.
   * @memberof NotificationsScreen
   */
  fetchNotifications = async () => {
    await this.props.fetchNotifications();
    this.props.markNotificationsAsSeen();
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
      this.props.markNotificationsAsSeen();
    }
  };

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
      <TouchableOpacity onPress={() => this.onNotificationPressed(activity)}>
        <View style={[styles.parentItem, { opacity: item.isRead ? 0.7 : 1 }]}>
          <View style={styles.iconContainer}>
            <Icon name="circle" style={[styles.icon, !item.isRead && styles.iconUnread]} />
          </View>
          <View style={styles.detailsContainer}>
            <View style={{ paddingRight: 10 }}>
              <Image style={styles.userAvatar} source={{ uri: ava }} />
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
    const {
      notifications,
      notificationsUnread,
      loadingNotifications,
      fetchNotifications,
      markingRead,
    } = this.props;
    return (
      <View style={styles.container}>
        <CustomHeader
          markingRead={markingRead}
          notificationsUnread={notificationsUnread}
          onMarkAll={this.onMarkAll}
        />
        <FlatList
          ListHeaderComponent={this.renderHeader}
          removeClippedSubviews={false}
          data={notifications}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.renderItemSeperator}
          initialNumToRender={10}
          refreshing={loadingNotifications}
          onRefresh={fetchNotifications}
          onEndReached={this.fetchMoreNotifications}
          onEndReachedThreshold={0.3}
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
  markNotificationsAsSeen: PropTypes.func.isRequired,
  markAllNotificationsAsRead: PropTypes.func.isRequired,
  notificationsUnread: PropTypes.number.isRequired,
  markingRead: PropTypes.bool.isRequired,
  pushNotificationEnabled: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ feed, user, app }) => {
  const { notifications, notificationsUnread, loadingNotifications, markingRead } = feed;
  const { currentUser } = user;
  const { pushNotificationEnabled } = app;
  return {
    notifications,
    notificationsUnread,
    loadingNotifications,
    currentUser,
    pushNotificationEnabled,
    markingRead,
  };
};
export default connect(mapStateToProps, {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationsAsSeen,
})(NotificationsScreen);


/**
 * Parses notification data into usable objects.
 * Used in in-app notification modal and notification screen render
 *
 * @param {object} activities notification data received from API
 * @param {number} currentUserId logged in user ID
 * @returns {object} notificationData
 *  - @returns {string} actorName notification actor name
 *  - @returns {string} actorAvatar notification actor avatar URL
 *  - @returns {string} text notification text (ex: mentioned you.)
 *  - @returns {string} others other users involved in notification
 */
export const parseNotificationData = (activities, currentUserId) => {
  const notificationData = {
    actorName: null,
    actorAvatar: null,
    text: '',
    others: null,
  };

  const activity = activities[0];
  const { replyToType, replyToUser, mentionedUsers, target, actor } = activity;

  // actor
  notificationData.actorName = actor && `${actor.name} `;

  notificationData.actorAvatar =
    actor && actor.avatar
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
  switch (activities[0].verb) {
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
    case 'comment':
      if (currentUserId === replyToUser.split(':')[1]) {
        notificationData.text = `replied to your ${replyToType}.`;
      } else if (isMentioned(mentionedUsers || [], currentUserId)) {
        notificationData.text = 'mentioned you in a comment.';
      } else {
        notificationData.text = 'replied to';
        if (target && target[0] && target[0].user) {
          if (target[0].user.id === actor.id) {
            notificationData.text = `${notificationData.text} their`;
          } else if (target[0].user.id === currentUserId) {
            notificationData.text = `${notificationData.text} your`;
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
