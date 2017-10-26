import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { defaultAvatar } from 'kitsu/constants/app';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

const CommentBubble = ({ name, content }) => (
  <View style={styles.bubble}>
    <StyledText size="xxsmall" color="dark" bold>{name}</StyledText>
    <StyledText size="xsmall" color="dark">{content}</StyledText>
  </View>
);

CommentBubble.propTypes = {
  name: PropTypes.string,
  content: PropTypes.string,
};
CommentBubble.defaultProps = {
  name: null,
  content: null,
};

export const Comment = ({ comment, onPress, children }) => {
  const { content, user } = comment;
  const { avatar, name } = user;

  return (
    <TouchableOpacity onPress={onPress}>
      <Layout.RowWrap>
        <Avatar avatar={(avatar && avatar.medium) || defaultAvatar} size="medium" />
        <Layout.RowMain>
          <CommentBubble name={name} content={content} />
          <View style={styles.commentActions} />
          {children && (
            <View style={styles.nestedCommentSection}>{children}</View>
          )}
        </Layout.RowMain>
      </Layout.RowWrap>
    </TouchableOpacity>
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
  onPress: PropTypes.func,
};

Comment.defaultProps = {
  children: [],
  onPress: null,
};
