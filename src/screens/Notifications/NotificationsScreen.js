import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as colors from 'kitsu/constants/colors';
import { getNotifications, seenNotifications } from 'kitsu/store/feed/actions';

const isMentioned = (arr, id) => arr.includes(id);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkPurple,
    flex: 1,
  },
  noticeContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
    backgroundColor: colors.white,
    marginBottom: 6,
    position: 'relative',
  },
  noticeText: {
    fontWeight: '600',
    fontFamily: 'Open Sans',
    paddingVertical: 10,
  },
  actionButton: {
    backgroundColor: colors.green,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionButtonText: {
    color: colors.white,
  },
  closeIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    color: colors.grey,
    fontSize: 18,
  },
  outerText: {
    color: 'black',
    fontFamily: 'OpenSans',
    fontSize: 16,
    lineHeight: 18,
    fontWeight: 'bold',
  },
  innerText: {
    color: 'black',
    fontFamily: 'OpenSans',
    fontSize: 12,
    lineHeight: 12,
    fontWeight: '600',
  },
  parentItem: {
    flexDirection: 'row',
    backgroundColor: colors.offWhite,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  itemSeperator: {
    borderWidth: 1,
    borderColor: colors.darkPurple,
  },
  iconContainer: { justifyContent: 'center', paddingLeft: 5, paddingRight: 10, width: 25 },
  icon: { fontSize: 8, color: '#FF102E' },
  detailsContainer: { alignItems: 'center', flexDirection: 'row', flex: 1 },
  userAvatar: { width: 32, height: 32, borderRadius: 16 },
  activityContainer: { flex: 1, justifyContent: 'center' },
  activityTextContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  activityText: { fontFamily: 'OpenSans', fontSize: 12, fontWeight: '400' },
  activityTextHighlight: { color: '#FF300A', fontWeight: '500' },
  activityMetaContainer: { justifyContent: 'flex-start' },
  activityMetaText: { fontSize: 10, color: '#919191' },
});

class NotificationsScreen extends Component {
  static navigationOptions = () => ({
    title: 'Notifications',
    headerStyle: {
      backgroundColor: colors.darkPurple,
      shadowOpacity: 0,
      height: 64,
    },
  });

  state = {
    offset: 0,
  };

  componentDidMount() {
    this.props.getNotifications();
  }

  loadMore = () => {
    // const offset = this.state.offset + 30;
    // this.props.getNotifications(offset);
    // this.setState({ offset });
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
      case 'comment':
        if (id === replyToUser.split(':')[1]) {
          text = `replied to your ${replyToType}.`;
        } else if (isMentioned(mentionedUsers || [], id)) {
          text = 'mentioned you in a comment.';
        } else {
          text = 'replied to';
          if (target && target[0].user) {
            if (target[0].user[0].id === actor.id) {
              text = `${text} their`;
            } else if (target[0].user[0].id === id) {
              text = `${text} your`;
            }
          } else {
            text = `${text} a`;
          }
          text = `${text} post.`;
        }
        return <Text>{text}</Text>;
      default:
        return <Text>made an action</Text>;
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

  renderHeader = () => (
    <View style={styles.noticeContainer}>
      <Text style={styles.noticeText}>Kitsu is better with notifications!</Text>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Turn on notifications</Text>
      </TouchableOpacity>
      <Icon name="close" style={styles.closeIcon} />
    </View>
  );

  render() {
    const { notifications, loadingNotifications, getNotifications } = this.props;
    return (
      <FlatList
        ListHeaderComponent={this.renderHeader}
        removeClippedSubviews={false}
        data={notifications}
        renderItem={this.renderItem}
        onEndReached={this.loadMore}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0.5}
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

const mapStateToProps = ({ feed, user }) => {
  const { notifications, notificationsUnseen, loadingNotifications } = feed;
  const { currentUser } = user;
  return { notifications, notificationsUnseen, loadingNotifications, currentUser };
};
export default connect(mapStateToProps, { getNotifications, seenNotifications })(
  NotificationsScreen,
);
