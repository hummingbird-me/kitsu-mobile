import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as colors from 'kitsu/constants/colors';
import { getNotifications, seenNotifications } from 'kitsu/store/feed/actions';

class NotificationsScreen extends Component {
  static navigationOptions = ({ screenProps }) => ({
    title: 'Notifications',
    headerStyle: {
      backgroundColor: colors.darkPurple,
      shadowOpacity: 0,
      height: 64,
    },
  });

  state = {
    offset: 0,
  }

  componentDidMount() {
    this.props.getNotifications();
  }

  loadMore = () => {
    // const offset = this.state.offset + 30;
    // this.props.getNotifications(offset);
    // this.setState({ offset });
  }

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
  }

  renderItem = ({ item }) => {
    const activity = item.activities[0];
    let others = null;
    if (item.activities.length > 1) {
      others = item.activities.length === 2
        ? (<Text style={{ color: '#FF300A', fontWeight: '500' }}>
          {item.activities[1].actor ? item.activities[1].actor.name : 'Unknown'}{' '}
        </Text>)
        : (<Text>
          <Text style={{ fontWeight: '600' }}>{item.activities.length - 1}</Text> others{' '}
        </Text>);
    }
    const ava = activity.actor && activity.actor.avatar
      ? activity.actor.avatar.tiny
      : 'https://staging.kitsu.io/images/default_avatar-ff0fd0e960e61855f9fc4a2c5d994379.png';

    return (
      <TouchableOpacity button style={{ ...styles.parentItem, padding: 5 }}>
        <View style={{ justifyContent: 'center', paddingLeft: 5, paddingRight: 10, width: 25 }}>
          {!item.isRead && <Icon name="circle" style={{ fontSize: 8, color: '#FF102E' }} />}
        </View>
        <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1 }}>
          <View style={{ paddingRight: 10 }}>
            <Image style={{ width: 32, height: 32, borderRadius: 16 }} source={{ uri: ava }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '400' }}>
                <Text style={{ color: '#FF300A', fontWeight: '500' }}>
                  {activity.actor && activity.actor.name}{' '}
                </Text>
                {others && <Text>and {others}</Text>}
                {this.renderText(activity)}
              </Text>
            </View>
            <View style={{ justifyContent: 'flex-start' }}>
              <Text style={{ fontSize: 10, color: '#919191' }}>
                {moment(activity.time).fromNow()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { notifications, loadingNotifications } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        <FlatList
          removeClippedSubviews={false}
          data={notifications}
          renderItem={this.renderItem}
          onEndReached={() => this.loadMore()}
          keyExtractor={item => item.id}
          onEndReachedThreshold={0.5}
          initialNumToRender={30}
          refreshing={loadingNotifications}
          onRefresh={() => this.props.getNotifications()}
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

const isMentioned = (arr, id) => arr.includes(id);

const styles = {
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
    height: 65,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEEEEE',
    backgroundColor: '#FAFAFA',
  },
};

const mapStateToProps = ({ feed, user }) => {
  const { notifications, notificationsUnseen, loadingNotifications } = feed;
  const { currentUser } = user;
  return { notifications, notificationsUnseen, loadingNotifications, currentUser };
};
export default connect(mapStateToProps, { getNotifications, seenNotifications })(
  NotificationsScreen,
);
