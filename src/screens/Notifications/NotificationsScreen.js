import React, { PureComponent } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import OneSignal from 'react-native-onesignal';
import moment from 'moment';
import * as colors from 'kitsu/constants/colors';
import { getNotifications, seenNotifications } from 'kitsu/store/feed/actions';
import { styles } from './styles';

const isMentioned = (arr, id) => arr.includes(id);

class NotificationsScreen extends PureComponent {
  static navigationOptions = () => ({
    title: 'Notifications',
  });

  componentDidMount() {
    this.props.getNotifications();
  }

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
          console.log(target);
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
          <Text style={{ color: '#FF300A', fontWeight: '500' }}>
            {item.activities[1].actor ? item.activities[1].actor.name : 'Unknown'}{' '}
          </Text>
        ) : (
            <Text>
              <Text style={{ fontWeight: '600' }}>{item.activities.length - 1}</Text> others{' '}
            </Text>
          );
    }
    const ava =
      activity.actor && activity.actor.avatar
        ? activity.actor.avatar.tiny
        : 'https://staging.kitsu.io/images/default_avatar-ff0fd0e960e61855f9fc4a2c5d994379.png';

    return (
      <TouchableOpacity style={[styles.parentItem, { opacity: item.isRead ? 0.7 : 1 }]}>
        <View style={styles.iconContainer}>
          <Icon name="circle" style={styles.icon} />
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
    const { notifications, loadingNotifications, getNotifications } = this.props;
    return (
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
  const { notifications, notificationsUnseen, loadingNotifications } = feed;
  const { currentUser } = user;
  const { pushNotificationEnabled } = app;
  return {
    notifications,
    notificationsUnseen,
    loadingNotifications,
    currentUser,
    pushNotificationEnabled,
  };
};
export default connect(mapStateToProps, { getNotifications, seenNotifications })(
  NotificationsScreen,
);
