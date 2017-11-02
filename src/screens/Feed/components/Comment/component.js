import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { defaultAvatar } from 'kitsu/constants/app';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const Comment = ({ comment, onPress, isTruncated, children }) => {
  const { content, user } = comment;
  const { avatar, name } = user;

  const WrapComponent = (props) => {
    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} {...props} />
      );
    }

    return (
      <View {...props} />
    );
  };

  return (
    <WrapComponent>
      <Layout.RowWrap>
        <Avatar avatar={(avatar && avatar.medium) || defaultAvatar} size="medium" />
        <Layout.RowMain>
          <View style={styles.bubble}>
            <StyledText size="xxsmall" color="dark" bold>{name}</StyledText>
            <StyledText size="xsmall" color="dark" numberOfLines={isTruncated && 2}>
              {content}
            </StyledText>
          </View>
          <View style={styles.commentActions} />
          {children && (
            <View style={styles.nestedCommentSection}>{children}</View>
          )}
        </Layout.RowMain>
      </Layout.RowWrap>
    </WrapComponent>
  );
};


Comment.propTypes = {
  comment: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
    content: PropTypes.string,
    time: PropTypes.string,
    children: PropTypes.array,
  }).isRequired,
  children: PropTypes.node,
  isTruncated: PropTypes.bool,
  onPress: PropTypes.func,
};

Comment.defaultProps = {
  children: [],
  isTruncated: false,
  onPress: null,
};
