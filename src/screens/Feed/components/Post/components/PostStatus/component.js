import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const PostStatus = ({ likesCount, commentsCount, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.postStatusRow}>
      <StyledText color="grey" size="xxsmall">{likesCount} likes</StyledText>
      <StyledText color="grey" size="xxsmall">{commentsCount} comments</StyledText>
    </View>
  </TouchableWithoutFeedback>
);

PostStatus.propTypes = {
  likesCount: PropTypes.number,
  commentsCount: PropTypes.number,
  onPress: PropTypes.func,
};

PostStatus.defaultProps = {
  likesCount: 0,
  commentsCount: 0,
  onPress: null,
};
