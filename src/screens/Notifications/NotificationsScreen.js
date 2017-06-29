import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { Container } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import moment from 'moment';

import * as colors from '../../constants/colors';
import { getNotifications, seenNotifications } from '../../store/feed/actions';

class NotificationsScreen extends Component {
  static navigationOptions = ({ screenProps }) => ({
    title: 'Notifications',
    headerStyle: {
      backgroundColor: colors.darkPurple,
      shadowOpacity: 0,
      height: 64,
    },
    tabBarIcon: ({ tintColor }) => (
      <View>
        {screenProps &&
          screenProps.badge > 0 &&
          <View
            style={{
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
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 10,
                minWidth: 14,
                fontWeight: '700',
                textAlign: 'center',
                fontFamily: 'OpenSans',
              }}
            >
              {screenProps.badge}
            </Text>
          </View>}
        <Icon name="bell" style={{ fontSize: 24, color: tintColor }} />
      </View>
    ),
  });
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderText = this.renderText.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.props.getNotifications();
  }

  loadMore() {
    // const offset = this.state.offset + 30;
    // this.props.getNotifications(offset);
    // this.setState({ offset });
  }

  renderText(activity) {
    const { profile: { id } } = this.props;
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
        } else if (isMentioned(mentionedUsers, id)) {
          text = 'mentioned you in a comment.';
        } else {
          text = 'replied to';
          if (target && target[0].user) {
            if (target[0].user[0].id === actor[0].id) {
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

  renderItem({ item }) {
    const activity = item.activities[0];
    let others = null;
    if (item.activities.length > 1) {
      others = item.activities.length === 2
        ? (<Text style={{ color: '#FF300A', fontWeight: '500' }}>
          {item.activities[1].actor[0] ? item.activities[1].actor[0].name : 'Unknown'}{' '}
        </Text>)
        : (<Text>
          <Text style={{ fontWeight: '600' }}>{item.activities.length - 1}</Text> others{' '}
        </Text>);
    }
    const ava = activity.actor && activity.actor[0].avatar
      ? activity.actor[0].avatar.tiny
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
                  {activity.actor && activity.actor[0].name}{' '}
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
      <Container style={{ backgroundColor: '#FAFAFA' }}>
        <FlatList
          removeClippedSubviews={false}
          data={notifications}
          renderItem={this.renderItem}
          onEndReached={() => this.loadMore()}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0.5}
          initialNumToRender={30}
          refreshing={loadingNotifications}
          onRefresh={() => this.props.getNotifications()}
        />
      </Container>
    );
  }
}

NotificationsScreen.propTypes = {
  getNotifications: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
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
  const { profile } = user;
  return { notifications, notificationsUnseen, loadingNotifications, profile };
};
export default connect(mapStateToProps, { getNotifications, seenNotifications })(
  NotificationsScreen,
);
