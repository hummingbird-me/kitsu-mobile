import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { indexOf, isEmpty } from 'lodash';
import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { PostMeta } from 'kitsu/screens/Feed/components/PostMeta';
import { PostTextInput } from 'kitsu/screens/Feed/components/PostTextInput';
import { HeaderButton } from 'kitsu/screens/Feed/components/HeaderButton';
import { PickerModal } from 'kitsu/screens/Feed/components/PickerModal';
import { feedStreams } from '../feedStreams';

class CreatePost extends React.PureComponent {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    onNewPostCreated: PropTypes.func,
  }

  static defaultProps = {
    onNewPostCreated: null,
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Create Post',
      headerTitleStyle: {
        alignSelf: 'center',
        color: '#FFFFFF',
        fontSize: 15,
      },
      headerLeft: <HeaderButton onPress={() => navigation.goBack()} title="Cancel" />,
      headerRight: (
        <HeaderButton
          highlighted
          disabled={params.busy}
          loading={params.busy}
          onPress={params.handlePressPost}
          title="Post"
        />
      ),
    };
  };

  state = {
    feedPickerModalIsVisible: false,
    content: '',
    currentFeed: feedStreams[0],
    error: '',
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handlePressPost: this.handlePressPost,
      busy: false,
    });
  }

  handleFeedPicker = (currentFeed) => {
    this.setState({ currentFeed });
    this.postTextInput.focus();
    this.handleFeedPickerModal(false);
  }

  handleFeedPickerModal = (feedPickerModalIsVisible) => {
    this.setState({ feedPickerModalIsVisible });
  }

  handlePressPost = async () => {
    const { navigation } = this.props;
    if (navigation.state.params.busy) return;

    navigation.setParams({ busy: true });
    this.setState({ error: '' });

    const currentUserId = this.props.currentUser.id;
    const { content, currentFeed } = this.state;

    // Target interest is either 'anime', 'manga', or blank depending
    // on the feed we want to post to.
    const ignoredTargetFeeds = ['followingFeed', 'globalFeed'];
    const currentFeedIndex = indexOf(ignoredTargetFeeds, currentFeed.key);
    const targetInterest = currentFeedIndex !== -1 ? currentFeed.key : undefined;

    try {
      const post = await Kitsu.create('posts', {
        content,
        targetInterest,
        user: {
          type: 'users',
          id: currentUserId,
        },
      });

      if (this.props.navigation.state.params.onNewPostCreated) {
        this.props.navigation.state.params.onNewPostCreated(post);
      }
    } catch (err) {
      const string = (e && e[0].detail) || 'Failed to create post.';
      this.setState({ error: string });
      console.error(err);
    }

    this.props.navigation.setParams({ busy: false });

    // Take user back to the feeds
    if (isEmpty(this.state.error)) this.props.navigation.goBack();
  }

  render() {
    const { currentUser } = this.props;
    const { error } = this.state;

    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      >
        <View style={{ flex: 1 }}>
          { /* Error */}
          {!isEmpty(error) &&
            <View style={{ padding: 6, backgroundColor: '#CC6549' }}>
              <Text style={{ color: 'white' }}>
                An Error Occurred. {error}
              </Text>
            </View>
          }
          <PostMeta
            avatar={(currentUser.avatar && currentUser.avatar.medium) || defaultAvatar}
            author={currentUser.name}
            feedTitle={this.state.currentFeed.title}
            onFeedPillPress={() => this.handleFeedPickerModal(true)}
          />
          <PostTextInput
            inputRef={(el) => { this.postTextInput = el; }}
            multiline
            numberOfLines={4}
            onChangeText={content => this.setState({ content })}
            value={this.state.content}
            placeholder="Write something...."
            placeholderTextColor={colors.grey}
            autoCorrect={false}
            autoFocus
            returnKeyType="done"
            underlineColorAndroid="transparent"
          />
        </View>
        <PickerModal
          visible={this.state.feedPickerModalIsVisible}
          data={feedStreams}
          currentPick={this.state.currentFeed}
          onCancelPress={() => this.handleFeedPickerModal(false)}
          onDonePress={feed => this.handleFeedPicker(feed)}
        />
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export default connect(mapStateToProps)(CreatePost);
