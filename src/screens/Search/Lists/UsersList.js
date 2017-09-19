import * as React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableHighlight } from 'react-native';
import * as PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DEFAULT_AVATAR from 'kitsu/assets/img/default_avatar.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userList: {
    backgroundColor: '#fff',
    paddingLeft: 8,
  },
  userContainer: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#979797',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  userAvatar: {
    width: 61,
    height: 61,
    borderRadius: 61 / 2,
  },
  userLeftSection: {
    flexDirection: 'row',
    flex: 7,
  },
  userRightSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 3,
  },
  userMetaContainer: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  userNameText: {
    color: '#333333',
    fontWeight: '500',
  },
  userFollowText: {
    color: '#616161',
  },
  actionButton: {
    backgroundColor: '#16A085',
    borderRadius: 2,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 25,
    paddingRight: 25,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  moreIcon: {
    color: '#ADADAD',
  },
});

const User = ({ user, onFollow }) => {
  const userAvatar = user.avatar ? { uri: user.avatar.small } : DEFAULT_AVATAR;
  const followerTxt = user.followersCount > 1 ? 'followers' : 'follower';
  return (
    <View style={styles.userContainer}>
      <View style={styles.userLeftSection}>
        <Image source={userAvatar} style={styles.userAvatar} />
        <View style={styles.userMetaContainer}>
          <Text style={styles.userNameText}>{user.name}</Text>
          <Text style={styles.userFollowText}>{`${user.followersCount} ${followerTxt}`}</Text>
        </View>
      </View>
      <View style={styles.userRightSection}>
        <TouchableHighlight style={styles.actionButton} onPress={() => onFollow(user.id)}>
          <Text style={styles.actionButtonText}>Follow</Text>
        </TouchableHighlight>
        <FontAwesome name="ellipsis-v" size={20} style={styles.moreIcon} />
      </View>
    </View>
  );
};

User.propTypes = {
  user: PropTypes.object,
  onFollow: PropTypes.func,
};

const UsersList = ({ hits, onFollow, onData }) => {
  // Send users data to reducer to maintain single source of truth
  onData(hits);

  return (
    <FlatList
      removeClippedSubviews={false}
      data={hits}
      style={styles.container}
      scrollEnabled
      contentContainerStyle={styles.userList}
      renderItem={({ item }) => <User key={`${item.name}`} user={item} onFollow={onFollow} />}
    />
  );
};

UsersList.propTypes = {
  hits: PropTypes.array,
  onFollow: PropTypes.func.isRequired,
  onData: PropTypes.func.isRequired,
};

UsersList.defaultProps = {
  hits: [],
  refine: () => {},
};

export default UsersList;
