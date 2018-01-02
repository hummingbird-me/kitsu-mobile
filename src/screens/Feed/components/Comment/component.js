import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import { defaultAvatar } from 'kitsu/constants/app';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { CommentTextInput } from 'kitsu/screens/Feed/components/CommentTextInput';
import { StyledText } from 'kitsu/components/StyledText';
import { listBackPurple } from 'kitsu/constants/colors';
import { Kitsu } from 'kitsu/config/api';
import { styles } from './styles';

export class Comment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      likesCount: props.comment.likesCount,
      like: null,
      reply: '',
      replies: [],
      repliesCount: props.comment.repliesCount,
      isReplyInputShown: false,
      isLoadingNextPage: false,
    };
  }

  componentDidMount() {
    this.mounted = true;
    if (!this.props.isTruncated) {
      this.fetchLikes();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fetchLikes = async () => {
    const { currentUser, comment } = this.props;
    try {
      const likes = await Kitsu.findAll('commentLikes', {
        filter: {
          commentId: comment.id,
          userId: currentUser.id,
        }
      });

      const like = likes.length && likes[0];
      if (this.mounted) this.setState({ like });
    } catch (err) {
      console.log('Error fetching likes: ', err);
    }
  }

  toggleLike = async () => {
    try {
      const { likesCount, like } = this.state;
      const { comment, currentUser } = this.props;

      this.setState({
        likesCount: !!like ? likesCount - 1 : likesCount + 1,
      });

      if (like) {
        await Kitsu.destroy('commentLikes', like.id);
      } else {
        const record = await Kitsu.create('commentLikes', {
          comment: {
            id: comment.id,
            type: 'comments',
          },
          user: {
            id: currentUser.id,
            type: 'users',
          },
        });
        this.setState({ like: record });
      }
    } catch (err) {
      console.log('Error toggling like: ', err);
      this.setState({
        likesCount: !!like ? likesCount - 1 : likesCount + 1,
      });
    }
  }

  onPagination = async () => {
    this.setState({ isLoadingNextPage: true });
    await this.fetchReplies({
      page: {
        offset: this.state.replies.length,
        limit: 5,
      },
    });
    this.setState({ isLoadingNextPage: false });
  }

  fetchReplies = async (requestOptions = {}) => {
    try {
      this.setState({ isLoadingNextPage: true });

      const replies = await Kitsu.findAll('comments', {
        filter: {
          parentId: this.props.comment.id,
        },
        fields: {
          users: 'avatar,name',
        },
        include: 'user',
        sort: '-createdAt',
        page: { limit: 5 },
        ...requestOptions,
      });

      this.setState({ replies: [...replies.reverse(), ...this.state.replies] });
    } catch (err) {
      console.log('Error fetching replies: ', err);
    } finally {
      this.setState({ isLoadingNextPage: false });
    }
  }

  onReplyPress = (mention) => {
    if (!this.isReplyInputShown) {
      this.setState({ isReplyInputShown: true });
    }
    if (mention && typeof mention === 'string') {
      this.setState({ reply: `@${mention} ` });
    }
    if (this.replyInputRef) {
      this.replyInputRef.focus();
    }
  }

  onReplyChanged = (reply) => { this.setState({ reply }); }

  onSubmitReply = async () => {
    try {
      const { currentUser, post, comment } = this.props;

      const reply = await Kitsu.create('comments', {
        content: this.state.reply,
        post: {
          id: post.id,
          type: 'posts',
        },
        parent: {
          id: comment.id,
          type: 'comments',
        },
        user: {
          id: currentUser.id,
          type: 'users',
        },
      });
      reply.user = currentUser;

      this.setState({
        reply: '',
        replies: [...this.state.replies, reply],
        repliesCount: this.state.repliesCount + 1,
      });
    } catch (err) {
      console.log('Error submitting reply: ', err);
    }
  }

  renderItem = ({ item }) => (
    <Comment
      post={this.props.post}
      comment={item}
      currentUser={this.props.currentUser}
      onAvatarPress={() => this.navigateToUserProfile(item.user.id)}
      onReplyPress={() => this.onReplyPress(item.user.name)}
    />
  )

  render() {
    const {
      comment,
      isTruncated,
      onAvatarPress,
    } = this.props;

    let { onReplyPress } = this.props;
    onReplyPress = onReplyPress || this.onReplyPress;

    const { like, likesCount, reply, replies, repliesCount, isReplyInputShown } = this.state;

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
            <StyledText size="xsmall" color="dark" numberOfLines={(isTruncated && 2) || undefined}>
              {content}
            </StyledText>
          </View>

          {!isTruncated && (
            <View style={styles.commentActions}>
              <StyledText color="grey" size="xxsmall">{moment(createdAt).fromNow()}</StyledText>
              <TouchableOpacity onPress={this.toggleLike} style={styles.commentActionItem}>
                <StyledText color="grey" size="xxsmall">{`Like${!!like ? 'd' : ''}`}</StyledText>
              </TouchableOpacity>
              <TouchableOpacity onPress={onReplyPress} style={styles.commentActionItem}>
                <StyledText color="grey" size="xxsmall">Reply</StyledText>
              </TouchableOpacity>
              <View style={styles.commentActionItem}>
                <Icon name={!!like ? 'md-heart' : 'md-heart-outline'} style={[styles.likeIcon, !!like && styles.likeIcon__active]} />
                <StyledText color={!!like ? 'red' : 'grey'} size="xxsmall">{likesCount}</StyledText>
              </View>
            </View>
          )}

          {!isTruncated && repliesCount > 0 && (
            <View style={styles.nestedComments}>
              {replies.length == 0 && (
                <ToggleReplies
                  onPress={() => { this.fetchReplies(); }}
                  isLoading={this.state.isLoadingNextPage}
                  repliesCount={repliesCount}
                />
              )}
              {replies.length > 0 && (
                <View>
                  {repliesCount > replies.length && (
                    <CommentPagination
                      onPress={this.onPagination}
                      isLoading={this.state.isLoadingNextPage}
                    />
                  )}
                  <FlatList
                    data={replies}
                    keyExtractor={(item, index) => index}
                    renderItem={this.renderItem}
                    ItemSeparatorComponent={() => <View style={{ height: 17 }} />}
                  />
                </View>
              )}
            </View>
          )}

          {!isTruncated && isReplyInputShown && (
            <View style={{ marginTop: 14 }}>
              <CommentTextInput
                inputRef={(el) => { this.replyInputRef = el; }}
                currentUser={this.props.currentUser}
                autoFocus={true}
                placeholderText="Write a reply..."
                comment={reply}
                onCommentChanged={this.onReplyChanged}
                onSubmit={this.onSubmitReply}
              />
            </View>
          )}
        </Layout.RowMain>
      </Layout.RowWrap>
    );
  }
}

Comment.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  comment: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
    content: PropTypes.string,
    time: PropTypes.string,
    likesCount: PropTypes.number,
    repliesCount: PropTypes.number,
    createdAt: PropTypes.string,
  }).isRequired,
  isTruncated: PropTypes.bool,
  onAvatarPress: PropTypes.func,
  onReplyPress: PropTypes.func,
};

Comment.defaultProps = {
  isTruncated: false,
  onAvatarPress: null,
  onReplyPress: null,
};

// TODO: Should change the design on this.
export const ToggleReplies = ({ onPress, isLoading, repliesCount }) => (
  <View>
    {isLoading && (
      <ActivityIndicator color={listBackPurple} />
    )}
    {!isLoading && (
      <TouchableOpacity onPress={onPress}>
        <StyledText color="dark" size="xxsmall" bold>View replies ({repliesCount})</StyledText>
      </TouchableOpacity>
    )}
  </View>
);

ToggleReplies.propTypes = {
  onPress: PropTypes.func,
  isLoading: PropTypes.bool,
  repliesCount: PropTypes.number,
};

ToggleReplies.defaultProps = {
  onPress: null,
  isLoading: false,
  repliesCount: 0,
};

export const CommentPagination = ({ onPress, isLoading }) => (
  <View style={{ marginBottom: 14 }}>
    {isLoading && (
      <ActivityIndicator color={listBackPurple} />
    )}
    {!isLoading && (
      <TouchableOpacity onPress={onPress}>
        <StyledText color="dark" size="xxsmall" bold>View previous comments</StyledText>
      </TouchableOpacity>
    )}
  </View>
);

CommentPagination.propTypes = {
  onPress: PropTypes.func,
  isLoading: PropTypes.bool,
};

CommentPagination.defaultProps = {
  onPress: null,
  isLoading: false,
};
