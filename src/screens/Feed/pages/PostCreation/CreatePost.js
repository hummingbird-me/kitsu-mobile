import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, View, Text, ScrollView, Platform } from 'react-native';
import { connect } from 'react-redux';
import { indexOf, isEmpty } from 'lodash';
import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { PostMeta } from 'kitsu/screens/Feed/components/PostMeta';
import { PostTextInput } from 'kitsu/screens/Feed/components/PostTextInput';
import { HeaderButton } from 'kitsu/screens/Feed/components/HeaderButton';
import { PickerModal } from 'kitsu/screens/Feed/components/PickerModal';
import { GiphyModal } from 'kitsu/screens/Feed/components/GiphyModal';
import { feedStreams } from 'kitsu/screens/Feed/feedStreams';
import { GIFImage } from './GIFImage';
import { GIFSelectText } from './GIFSelectText';

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
    giphyPickerModalIsVisible: false,
    content: '',
    currentFeed: feedStreams[0],
    error: '',
    gif: null,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handlePressPost: this.handlePressPost,
      busy: false,
    });
  }

  handleGiphy = (gif) => {
    this.setState({ gif });
    this.handleGiphyPickerModal(false);
  }

  handleGiphyPickerModal = (giphyPickerModalIsVisible) => {
    this.setState({ giphyPickerModalIsVisible });
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
    const { gif } = this.state;
    const currentUserId = this.props.currentUser.id;
    const { content, currentFeed } = this.state;

    if (navigation.state.params.busy) return;

    // Don't allow posting if content and gif is empty
    if (isEmpty(content)) {
      this.setState({ error: 'No content provided!' });
      return;
    };

    navigation.setParams({ busy: true });
    this.setState({ error: '' });

    // Add the gif to the content
    let additionalContent = content;
    if (gif && gif.url) {
      additionalContent += `\n${gif.url}`;
    }

    // Target interest is either 'anime', 'manga', or blank depending
    // on the feed we want to post to.
    const ignoredTargetFeeds = ['followingFeed', 'globalFeed'];
    const currentFeedIndex = indexOf(ignoredTargetFeeds, currentFeed.key);
    const targetInterest = currentFeedIndex !== -1 ? currentFeed.key : undefined;

    try {
      const post = await Kitsu.create('posts', {
        content: additionalContent,
        targetInterest,
        user: {
          type: 'users',
          id: currentUserId,
        },
      });

      if (this.props.navigation.state.params.onNewPostCreated) {
        this.props.navigation.state.params.onNewPostCreated(post);
      }

      this.props.navigation.goBack();
    } catch (err) {
      const string = (e && e[0].detail) || 'Failed to create post.';
      this.setState({ error: string });
      console.error(err);
    }

    this.props.navigation.setParams({ busy: false });
  }

  render() {
    const { currentUser, navigation } = this.props;
    const { error, gif } = this.state;
    const { busy } = navigation.state.params;

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
          <ScrollView style={{ flex: 1 }} >
            <PostTextInput
              inputRef={(el) => { this.postTextInput = el; }}
              multiline
              numberOfLines={0}
              onChangeText={content => this.setState({ content })}
              onContentSizeChange={({ nativeEvent }) => {
                // On android the text box doesn't auto grow, so we have to manually set the height
                if (Platform.OS === 'android') {
                  this.setState({ textInputHeight: nativeEvent.contentSize.height });
                }
              }}
              onSubmitEditing={() => {
                if (!this.state.content.endsWith('\n')) {
                  const content = `${this.state.content}\n`;
                  this.setState({ content });
                }
              }}
              height={Platform.select({ ios: null, android: (this.state.textInputHeight || 0) })}
              value={this.state.content}
              placeholder="Write something...."
              placeholderTextColor={colors.grey}
              autoCorrect={false}
              autoFocus
              returnKeyType="done"
              underlineColorAndroid="transparent"
              blurOnSubmit={false}
            />
            <View style={{ marginTop: 20 }}>
              { gif ?
                <GIFImage
                  disabled={busy}
                  uri={gif.url}
                  onClear={() => this.setState({ gif: null })}
                />
                :
                <GIFSelectText disabled={busy} onPress={() => this.handleGiphyPickerModal(true)} />
              }
            </View>
          </ScrollView>
        </View>
        <PickerModal
          visible={this.state.feedPickerModalIsVisible}
          data={feedStreams}
          currentPick={this.state.currentFeed}
          onCancelPress={() => this.handleFeedPickerModal(false)}
          onDonePress={feed => this.handleFeedPicker(feed)}
        />
        <GiphyModal
          visible={this.state.giphyPickerModalIsVisible}
          onCancelPress={() => this.handleGiphyPickerModal(false)}
          onGifSelect={g => this.handleGiphy(g)}
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
