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
  getNotifications,
  seenNotifications,
  markAllNotificationsAsRead,
} from 'kitsu/store/feed/actions';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';
import notification from 'kitsu/routes/notification';

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
  notificationsUnread: PropTypes.bool.isRequired,
  markingRead: PropTypes.bool.isRequired,
  onMarkAll: PropTypes.func.isRequired,
};

const isMentioned = (arr, id) => arr.includes(id);

class NotificationsScreen extends PureComponent {
  static navigationOptions = () => ({
    title: 'Notifications',
    header: null,
  });

  state = {
    notificationsUnread: false,
  };

  componentDidMount() {
    this.props.getNotifications();
  }

  onMarkAll = () => {
    this.props.markAllNotificationsAsRead();
  };

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
            comments: null,
            like: null,
            currentUser,
          });
        }
        break;
      default:
        break;
    }
  };

  // temporary request to fetch mediareactions & to navigate corresponding
  // media screen. (since we don't have mediareactions screen right now)
  fetchMediaReactions = async mediaId =>
    Kitsu.find('mediaReactions', mediaId, {
      include: 'user,anime,manga',
    });

  handleActionBtnPress = () => {
    if (Platform.OS === 'ios') {
      OneSignal.requestPermissions({ alert: true, sound: true, badge: true });
    }
  };

  renderText = (activity) => {
    const { currentUser: { id } } = this.props;
    const { replyToType, replyToUser, mentionedUsers, target, actor } = activity;
    let text = '';
    switch (activity.verb) {
      case 'follow':
        return <Text>followed you.</Text>;
      case 'post':
        return <Text>mentioned you in a post.</Text>;
      case 'post_like':
        return <Text>liked your post.</Text>;
      case 'comment_like':
        return <Text>liked your comment.</Text>;
      case 'invited':
        return <Text>invited you to a group.</Text>;
      case 'vote':
        return <Text>liked your reaction.</Text>;
      case 'comment':
        if (id === replyToUser.split(':')[1]) {
          text = `replied to your ${replyToType}.`;
        } else if (isMentioned(mentionedUsers || [], id)) {
          text = 'mentioned you in a comment.';
        } else {
          text = 'replied to';
          if (target && target[0] && target[0].user) {
            if (target[0].user.id === actor.id) {
              text = `${text} their`;
            } else if (target[0].user.id === id) {
              text = `${text} your`;
            }
          } else {
            text = `${text} a`;
          }
          text = `${text} post.`;
        }
        return <Text>{text}</Text>;
      default:
        return <Text>made an action.</Text>;
    }
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
                  {this.renderText(activity)}
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
      getNotifications,
      markingRead,
    } = this.props;
    console.log(notifications);
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
          onRefresh={getNotifications}
          style={styles.container}
        />
      </View>
    );
  }
}

NotificationsScreen.propTypes = {
  getNotifications: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired,
  loadingNotifications: PropTypes.bool.isRequired,
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
  getNotifications,
  seenNotifications,
  markAllNotificationsAsRead,
})(NotificationsScreen);
