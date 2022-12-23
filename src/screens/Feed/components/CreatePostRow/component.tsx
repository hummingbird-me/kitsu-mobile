import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { StyledText } from 'kitsu/components/StyledText';
import { defaultAvatar } from 'kitsu/constants/app';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';

import { styles } from './styles';

interface CreatePostRowComponentProps {
  currentUser: {
    id?: string;
    avatar?: {
      medium?: string;
    };
    name?: string;
  };
  targetUser?: {
    id?: string;
    name?: string;
  };
  onPress?(...args: unknown[]): unknown;
  title?: string;
  style?: object;
}

const CreatePostRowComponent = ({
  currentUser,
  targetUser,
  onPress,
  title,
  style,
}: CreatePostRowComponentProps) => {
  const defaultTitle = `Want to share an update, ${currentUser.name}?`;
  const shareTitle = `Share an update with ${
    targetUser ? targetUser.name : 'Someone'
  }`;
  const isTargetCurrentUser = targetUser
    ? targetUser.id === currentUser.id
    : true;
  return (
    <View style={[styles.wrap, style]}>
      <TouchableOpacity onPress={onPress}>
        <Layout.RowWrap alignItems="center">
          <Avatar
            avatar={
              (currentUser.avatar && currentUser.avatar.medium) || defaultAvatar
            }
          />
          <Layout.RowMain>
            <StyledText color="grey" size="xsmall">
              {title || (isTargetCurrentUser ? defaultTitle : shareTitle)}
            </StyledText>
          </Layout.RowMain>
        </Layout.RowWrap>
      </TouchableOpacity>
    </View>
  );
};

CreatePostRowComponent.defaultProps = {
  currentUser: null,
  targetUser: null,
  onPress: null,
  title: null,
  style: null,
};

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export const CreatePostRow = connect(mapStateToProps)(CreatePostRowComponent);
