import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

// CommentBubble
// Todo: make name dynamic
const CommentBubble = ({ name, content }) => (
  <View style={styles.bubble}>
    <StyledText size="xxsmall" color="dark" bold>Doaks</StyledText>
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

export const Comment = ({ comment }) => {
  const {
    avatar,
    name,
    content,
    time,
    showActions,
    children,
  } = comment.attributes;
  return (
    <View style={styles.wrap}>
      <Avatar avatar={avatar} size="medium" />
      <View style={styles.main}>
        <CommentBubble name={name} content={content} />
        {showActions && (
          <View style={styled.commentActions} />
        )}
        {children && (
          <View style={styled.nestedCommentSection}>{children}</View>
        )}
      </View>
    </View>
  );
};


Comment.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  content: PropTypes.string,
  time: PropTypes.string,
  showActions: PropTypes.bool,
  children: PropTypes.node,
};

Comment.defaultProps = {
  avatar: null,
  name: null,
  content: null,
  time: null,
  showActions: false,
  children: null,
};
