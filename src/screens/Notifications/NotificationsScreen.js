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
          this.resetScrollPosition();
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
  onNotificationPressed = async ({ activity, notification }) => {
    const { target, verb, actor } = activity;
    const { currentUser, navigation } = this.props;
    this.props.markNotifications([notification], 'read');
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
        if (target.length !== 0) {
          navigation.navigate('PostDetails', {
            post: target[0],
            comments: [],
            like: null,
            currentUser,
          });
        } else { // should be a "mention"
          const post = await this.fetchPost(activity);
          if (post) {
            navigation.navigate('PostDetails', {
              post,
              comments: [],
              like: null,
              currentUser,
            });
          }
        }
        break;
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
        include: 'user,targetUser,targetGroup,media',
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
      await this.props.markNotifications(this.props.notifications, 'seen');
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
      this.props.markNotifications(this.props.notifications, 'seen');
    }
  };

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
              <FastImage style={styles.userAvatar} source={{ uri: ava }} borderRadius={20} />
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
    const { notifications, notificationsUnread, loadingNotifications, markingRead } = this.props;
    return (
      <View style={styles.container}>
        <CustomHeader
          markingRead={markingRead}
          notificationsUnread={notificationsUnread}
          onMarkAll={this.onMarkAll}
        />
        <FlatList
          ref={(r) => { this.list = r; }}
          ListHeaderComponent={this.renderHeader}
          data={notifications}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
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
      notificationData.text = `${subject.number} of ${actor.canonicalTitle} ${state}!`
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
