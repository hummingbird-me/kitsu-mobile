import React from 'react';
import { View, TouchableOpacity, Share, Alert } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import * as colors from 'kitsu/constants/colors';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { kitsuConfig } from 'kitsu/config/env';
import { styles } from './styles';

const formatTime = (time) => (
  moment().diff(time, 'days') < 2 ? moment(time).calendar() : `${moment(time).format('DD MMMM')} at ${moment(time).format('H:MMA')}`
);

export const PostHeader = ({
  post,
  avatar,
  onAvatarPress,
  name,
  time,
  onBackButtonPress,
  onEditPress,
  onDelete,
  currentUser,
}) => {
  const user = (post && post.user);
  const isCurrentUser = (user && currentUser && user.id === currentUser.id);

  const postDateTime = formatTime(time);
  const editDateTime = `Edited ${formatTime(post.editedAt)}`;

  const canMutate = () => {
    const isStaffOrMod = currentUser.title === 'Staff' || currentUser.title === 'Mod';
    return isCurrentUser || isStaffOrMod;
  };

  const ACTION_OPTIONS = [
    {
      onSelected: async () => {
        if (!post) return;
        const url = `${kitsuConfig.kitsuUrl}/posts/${post.id}`;
        const key = Platform.select({ ios: 'url', android: 'message' });
        Share.share({ [key]: url });
      },
      text: 'Share Post Link',
    },
    {
      condition: canMutate,
      onSelected: onEditPress,
      text: 'Edit Post',
    },
    {
      condition: canMutate,
      onSelected: () => {
        Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
          { text: 'Cancel', onPress: null, },
          { text: 'I\'m sure', onPress: onDelete, },
        ], { cancelable: false });
      },
      text: 'Delete Post',
    },
    {
      onSelected: null,
      text: 'Nevermind',
    },
  ].filter((action) => {
    if (action.condition) {
      return action.condition();
    }
    return true;
  });

  return (
    <View style={styles.postHeader}>
      <Layout.RowWrap alignItems="center">
        {onBackButtonPress && (
          <TouchableOpacity onPress={onBackButtonPress} style={styles.postHeaderBackButton}>
            <Icon name="ios-arrow-back" color={colors.listBackPurple} style={{ fontSize: 28 }} />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={onAvatarPress} style={styles.userDetailsLink}>
          <Avatar avatar={avatar} />
          <Layout.RowMain>
            <StyledText color="dark" size="xsmall" bold>{name}</StyledText>
            <StyledText color="grey" size="xxsmall" textStyle={{ marginTop: 3 }}>
              {postDateTime}
              {post.editedAt && " · "}
              {post.editedAt && editDateTime}
            </StyledText>
          </Layout.RowMain>
        </TouchableOpacity>

        <SelectMenu
          options={ACTION_OPTIONS}
          onOptionSelected={(value, option) => {
            if (option.onSelected) option.onSelected();
          }}
          activeOpacity={0.8}
        >
          <Icon name="ios-more" color={colors.lightGrey} style={styles.postHeaderActions} />
        </SelectMenu>
      </Layout.RowWrap>
    </View>
  );
};

PostHeader.propTypes = {
  post: PropTypes.object.isRequired,
  avatar: PropTypes.string,
  name: PropTypes.string,
  time: PropTypes.string,
  onBackButtonPress: PropTypes.func,
  onAvatarPress: PropTypes.func,
  currentUser: PropTypes.object,
};

PostHeader.defaultProps = {
  avatar: null,
  name: null,
  time: null,
  onBackButtonPress: null,
  onAvatarPress: null,
  currentUser: null,
};
