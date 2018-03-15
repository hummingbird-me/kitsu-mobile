import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, ActivityIndicator, FlatList, Text, Dimensions } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import { defaultAvatar } from 'kitsu/constants/app';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { CommentTextInput } from 'kitsu/screens/Feed/components/CommentTextInput';
import Hyperlink from 'react-native-hyperlink';
import { StyledText, ViewMoreStyledText } from 'kitsu/components/StyledText';
import { listBackPurple } from 'kitsu/constants/colors';
import { Kitsu } from 'kitsu/config/api';
import { isEmpty } from 'lodash';
import { preprocessFeedPosts } from 'kitsu/utils/preprocessFeed';
import { EmbeddedContent } from 'kitsu/screens/Feed/components/EmbeddedContent';
import { scenePadding } from 'kitsu/screens/Feed/constants';
import { handleURL } from 'kitsu/common/utils/url';
import { styles } from './styles';

export class Comment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      likesCount: props.comment.likesCount,
      isLiked: false,
      like: null,
      replies: [],
      repliesCount: props.comment.repliesCount,
      isLoadingNextPage: false,
      commentWidth: null,
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

  onPagination = async () => {
    this.setState({ isLoadingNextPage: true });
    try {
      await this.fetchReplies({
        page: {
          offset: this.state.replies.length,
          limit: 5,
        },
      });
    } catch (err) {
      console.log('Error fetching replies: ', err);
    }
    this.setState({ isLoadingNextPage: false });
  }

  onReplyPress = (item) => {
    this.props.onReplyPress(item.user, (comment) => {
      this.setState({
        replies: [...this.state.replies, comment],
        repliesCount: this.state.repliesCount + 1,
      });
    });
  }

  onCommentLayout = (event) => {
    // Only calculate this once, else we'll have lots of updates
    if (this.state.commentWidth) return;
    const { width } = event.nativeEvent.layout;
    // The width - left padding
    this.setState({ commentWidth: width - scenePadding });
  }

  fetchLikes = async () => {
    const { currentUser, comment } = this.props;
    try {
      const likes = await Kitsu.findAll('commentLikes', {
        filter: {
          commentId: comment.id,
          userId: currentUser.id,
        },
      });

      const like = likes.length && likes[0];
      if (this.mounted) {
        this.setState({ like, isLiked: !!like });
      }
    } catch (err) {
      console.log('Error fetching likes: ', err);
    }
  }

  toggleLike = async () => {
    try {
      const { likesCount, isLiked, like } = this.state;
      const { comment, currentUser } = this.props;

      this.setState({
        isLiked: !isLiked,
        likesCount: isLiked ? likesCount - 1 : likesCount + 1,
      });

      if (like) {
        await Kitsu.destroy('commentLikes', like.id);
        this.setState({ like: null });
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

      const { isLiked, likesCount } = this.state;
      this.setState({
        isLiked: !isLiked,
        likesCount: isLiked ? likesCount - 1 : likesCount + 1,
      });
    }
  }

  fetchReplies = async (requestOptions = {}) => {
    try {
      this.setState({ isLoadingNextPage: true });

      const replies = await Kitsu.findAll('comments', {
        filter: {
          parentId: this.props.comment.id,
        },
        fields: {
          users: 'slug,avatar,name',
        },
        include: 'user',
        sort: '-createdAt',
        page: { limit: 5 },
        ...requestOptions,
      });

      const processed = preprocessFeedPosts(replies);

      this.setState({ replies: [...processed.reverse(), ...this.state.replies] });
    } catch (err) {
      console.log('Error fetching replies: ', err);
    } finally {
      this.setState({ isLoadingNextPage: false });
    }
  }

  renderItem = ({ item }) => (
    <Comment
      post={this.props.post}
      comment={item}
      currentUser={this.props.currentUser}
      onAvatarPress={this.props.onAvatarPress}
      onReplyPress={() => this.onReplyPress(item)}
      hideEmbeds={this.props.hideEmbeds}
      navigation={this.props.navigation}
    />
  )

  render() {
    const {
      navigation,
      comment,
      isTruncated,
      onAvatarPress,
      hideEmbeds,
    } = this.props;

    const { isLiked, likesCount, replies, repliesCount, commentWidth } = this.state;

    const { content, createdAt, user, embed } = comment;

    // Get the user avatar and name
    const avatar = (user && user.avatar);
    const name = (user && user.name) || '-';

    const AvatarContainer = props => (
      user && onAvatarPress ?
        <TouchableOpacity onPress={() => onAvatarPress(user.id)} {...props} />
        :
        <View {...props} />
    );

    // The width of the embeds
    const maxEmbedWidth = commentWidth || 200;
    const minEmbedWidth = Math.max(100, maxEmbedWidth / 2);

    return (
      <Layout.RowWrap>
        <AvatarContainer>
          <Avatar avatar={(avatar && avatar.medium) || defaultAvatar} size="medium" />
        </AvatarContainer>
        <Layout.RowMain onLayout={this.onCommentLayout}>
          <View style={[styles.bubble, isEmpty(content) && styles.emptyBubble]}>
            <StyledText size="xxsmall" color="dark" bold>{name}</StyledText>
            {!isEmpty(content) &&
              <Hyperlink linkStyle={styles.linkStyle} onPress={url => handleURL(url, navigation)}>
                <ViewMoreStyledText
                  size="xsmall"
                  color="dark"
                  textStyle={{ lineHeight: null }}
                  numberOfLines={(isTruncated && 3) || 8}
                  selectable
                >
                  {content}
                </ViewMoreStyledText>

              </Hyperlink>
            }
          </View>

          { embed && !hideEmbeds &&
            <EmbeddedContent
              embed={embed}
              maxWidth={maxEmbedWidth}
              minWidth={minEmbedWidth}
              borderRadius={20}
              style={isEmpty(content) ? null : styles.embed}
              navigation={navigation}
            />
          }

          {!isTruncated && (
            <View style={styles.commentActions}>
              <StyledText color="grey" size="xxsmall">{moment(createdAt).fromNow()}</StyledText>
              <TouchableOpacity onPress={this.toggleLike} style={styles.commentActionItem}>
                <StyledText color="grey" size="xxsmall">{`Like${isLiked ? 'd' : ''}`}</StyledText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onReplyPress(comment)} style={styles.commentActionItem}>
                <StyledText color="grey" size="xxsmall">Reply</StyledText>
              </TouchableOpacity>
              <View style={styles.commentActionItem}>
                <Icon name={isLiked ? 'md-heart' : 'md-heart-outline'} style={[styles.likeIcon, isLiked && styles.likeIcon__active]} />
                <StyledText color={isLiked ? 'red' : 'grey'} size="xxsmall">{likesCount}</StyledText>
              </View>
            </View>
          )}

          {!isTruncated && repliesCount > 0 && (
            <View style={styles.nestedComments}>
              {replies.length === 0 && (
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
                    keyExtractor={item => item.id}
                    renderItem={this.renderItem}
                    ItemSeparatorComponent={() => <View style={{ height: 17 }} />}
                  />
                </View>
              )}
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
  navigation: PropTypes.object,
  isTruncated: PropTypes.bool,
  onAvatarPress: PropTypes.func,
  onReplyPress: PropTypes.func,
  hideEmbeds: PropTypes.bool,
};

Comment.defaultProps = {
  isTruncated: false,
  onAvatarPress: null,
  onReplyPress: null,
  hideEmbeds: false,
};

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
