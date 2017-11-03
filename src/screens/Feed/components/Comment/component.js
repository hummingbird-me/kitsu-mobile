import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import { defaultAvatar } from 'kitsu/constants/app';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export class Comment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLiked: false,
      likesCount: props.comment.likesCount,
    };
  }

  toggleLike = () => {
    this.setState({
      isLiked: !this.state.isLiked,
      likesCount: this.state.isLiked ? this.state.likesCount - 1 : this.state.likesCount + 1,
    });
  }

  render() {
    const {
      comment,
      isTruncated,
      onAvatarPress,
      onReplyPress,
      children,
    } = this.props;

    const { isLiked, likesCount } = this.state;

    const { content, createdAt, user } = comment;
    const { avatar, name } = user;
    const AvatarContainer = props => (
      onAvatarPress ? <TouchableOpacity onPress={onAvatarPress} {...props} /> : <View {...props} />
    );

    return (
      <Layout.RowWrap>
        <AvatarContainer>
          <Avatar avatar={(avatar && avatar.medium) || defaultAvatar} size="medium" />
        </AvatarContainer>
        <Layout.RowMain>
          <View style={styles.bubble}>
            <StyledText size="xxsmall" color="dark" bold>{name}</StyledText>
            <StyledText size="xsmall" color="dark" numberOfLines={isTruncated && 2}>
              {content}
            </StyledText>
          </View>
          {!isTruncated && (
            <View style={styles.commentActions}>
              <StyledText color="grey" size="xxsmall">{moment(createdAt).fromNow()}</StyledText>
              <TouchableOpacity onPress={this.toggleLike} style={styles.commentActionItem}>
                <StyledText color="grey" size="xxsmall">{`Like${isLiked ? 'd' : ''}`}</StyledText>
              </TouchableOpacity>
              <TouchableOpacity onPress={onReplyPress} style={styles.commentActionItem}>
                <StyledText color="grey" size="xxsmall">Reply</StyledText>
              </TouchableOpacity>
              <View style={styles.commentActionItem}>
                <Icon name={isLiked ? 'md-heart' : 'md-heart-outline'} style={[styles.likeIcon, isLiked && styles.likeIcon__active]} />
                <StyledText color={isLiked ? 'red' : 'grey'} size="xxsmall">{likesCount}</StyledText>
              </View>
            </View>
          )}
          {children && (
            <View style={styles.nestedCommentSection}>{children}</View>
          )}
        </Layout.RowMain>
      </Layout.RowWrap>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
    content: PropTypes.string,
    time: PropTypes.string,
    likesCount: PropTypes.number,
    createdAt: PropTypes.string,
    children: PropTypes.array,
  }).isRequired,
  children: PropTypes.node,
  isTruncated: PropTypes.bool,
  onAvatarPress: PropTypes.func,
  onReplyPress: PropTypes.func,
};

Comment.defaultProps = {
  children: [],
  isTruncated: false,
  onAvatarPress: null,
  onReplyPress: null,
};
