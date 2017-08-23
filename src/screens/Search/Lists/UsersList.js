import * as React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableHighlight } from 'react-native';
import * as PropTypes from 'prop-types';

const DEFAULT_AVATAR = require('kitsu/assets/img/default_avatar.png');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userList: {
    backgroundColor: '#fff',
    paddingLeft: 8,
  },
  userContainer: {
    paddingTop: 8,
    paddingBottom: 8,
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
});

const User = ({ user, onPress }) => {
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
      <TouchableHighlight style={styles.actionButton}>
        <Text style={styles.actionButtonText} onPress={onPress}>Follow</Text>
      </TouchableHighlight>
    </View>
  );
};

User.propTypes = {
  user: PropTypes.object,
  onPress: PropTypes.func,
};

const UsersList = ({ hits, hasMore, refine, onPress }) => {
  const onEndReached = () => {
    if (hasMore) {
      refine();
    }
  };

  return (
    <FlatList
      removeClippedSubviews={false}
      data={hits}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      style={styles.container}
      scrollEnabled
      contentContainerStyle={styles.userList}
      renderItem={({ item }) => <User key={`${item.name}`} user={item} onPress={onPress} />}
    />
  );
};

UsersList.propTypes = {
  hits: PropTypes.array.isRequired,
  hasMore: PropTypes.bool.isRequired,
  refine: PropTypes.func,
  onPress: PropTypes.func,
};

export default UsersList;
