import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, View, Text, ScrollView, Platform, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { PostMeta } from 'kitsu/screens/Feed/components/PostMeta';
import { PostTextInput } from 'kitsu/screens/Feed/components/PostTextInput';
import { HeaderButton } from 'kitsu/screens/Feed/components/HeaderButton';
import { GiphyModal } from 'kitsu/screens/Feed/components/GiphyModal';
import { MediaModal } from 'kitsu/screens/Feed/components/MediaModal';
import { feedStreams } from 'kitsu/screens/Feed/feedStreams';
import { CheckBox } from 'react-native-elements';
import { GIFImage } from './GIFImage';
import { AdditionalButton } from './AdditionalButton';
import { MediaItem } from './MediaItem';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  errorContainer: {
    padding: 6,
    backgroundColor: '#CC6549',
  },
  tagMedia: {
    margin: 10,
    marginBottom: 5,
  },
  addGIF: {
    margin: 10,
    marginTop: 5,
  },
  checkboxContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flex: 1,
  },
  checkbox: {
    marginRight: 0,
    padding: 8,
  },
});

class CreatePost extends React.PureComponent {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Create Post',
      headerTitleStyle: {
        color: '#FFFFFF',
        fontSize: 15,
        flex: 1,
        textAlign: 'center',
      },
      headerLeft: <HeaderButton onPress={() => navigation.goBack(null)} title="Cancel" />,
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
    giphyPickerModalIsVisible: false,
    mediaPickerModalIsVisible: false,
    content: '',
    currentFeed: feedStreams[0],
    error: '',
    gif: null,
    media: null,
    nsfw: false,
    spoiler: false,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handlePressPost: this.handlePressPost,
      busy: false,
    });
  }

  handleMedia = (media) => {
    this.setState({ media });
    this.handleMediaPickerModal(false);
  };

  handleGiphy = (gif) => {
    this.setState({ gif });
    this.handleGiphyPickerModal(false);
  }

  handleMediaPickerModal = (mediaPickerModalIsVisible) => {
    this.setState({ mediaPickerModalIsVisible });
  }

  handleGiphyPickerModal = (giphyPickerModalIsVisible) => {
    this.setState({ giphyPickerModalIsVisible });
  }

  handlePressPost = async () => {
    const { navigation } = this.props;
    const { targetUser } = navigation.state.params;
    const currentUserId = this.props.currentUser.id;
    const { content, currentFeed, gif, media, nsfw, spoiler } = this.state;

    if (navigation.state.params.busy) return;

    // Don't allow posting if content and gif is empty
    if (isEmpty(content)) {
      this.setState({ error: 'No content provided!' });
      return;
    }

    navigation.setParams({ busy: true });
    this.setState({ error: '' });

    // Add the gif to the content
    let additionalContent = content;
    if (gif && gif.id) {
      const gifURL = `https://media.giphy.com/media/${gif.id}/giphy.gif`;
      additionalContent += `\n${gifURL}`;
    }

    const mediaData = media ? {
      media: {
        id: media.id,
        type: media.kind,
      },
    } : {};

    const targetData = (targetUser && targetUser.id !== currentUserId) ? {
      targetUser: {
        type: 'users',
        id: targetUser.id,
      },
    } : {};

    // Target interest is either 'anime', 'manga', or blank depending
    // on the feed we want to post to.
    const targetInterest = currentFeed.targetInterest || undefined;

    // We can't set target_interest with targetUser
    const targetInterestData = isEmpty(targetData) ? { targetInterest } : {};

    try {
      const post = await Kitsu.create('posts', {
        content: additionalContent,
        ...targetInterestData,
        user: {
          type: 'users',
          id: currentUserId,
        },
        ...targetData,
        ...mediaData,
        nsfw,
        spoiler,
      });

      if (navigation.state.params.onNewPostCreated) {
        navigation.state.params.onNewPostCreated(post);
      }

      navigation.goBack();
    } catch (err) {
      const string = (err && err[0].detail) || 'Failed to create post.';
      this.setState({ error: string });
    }

    navigation.setParams({ busy: false });
  }

  render() {
    const { currentUser, navigation } = this.props;
    const {
      error,
      gif,
      media,
      currentFeed,
      content,
      giphyPickerModalIsVisible,
      mediaPickerModalIsVisible,
      nsfw,
      spoiler,
    } = this.state;
    const { busy, targetUser } = navigation.state.params;

    const isValidTargetUser = (targetUser && targetUser.id !== currentUser.id && targetUser.name);
    const placeholder = isValidTargetUser ? `Write something to ${targetUser.name}` : 'Write something....';

    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.main}
      >
        <View style={styles.flex}>
          { /* Error */}
          {!isEmpty(error) &&
            <View style={styles.errorContainer}>
              <Text style={{ color: 'white' }}>
                An Error Occurred. {error}
              </Text>
            </View>
          }
          <PostMeta
            avatar={(currentUser.avatar && currentUser.avatar.medium) || defaultAvatar}
            author={currentUser.name}
            feedTitle={currentFeed.title}
            targetName={(isValidTargetUser && targetUser.name) || ''}
          />
          <ScrollView style={styles.flex} >
            <PostTextInput
              inputRef={(el) => { this.postTextInput = el; }}
              multiline
              onChangeText={c => this.setState({ content: c })}
              value={content}
              placeholder={placeholder}
              placeholderTextColor={colors.grey}
              autoCorrect
              autoFocus
              autoCapitalize="sentences"
              underlineColorAndroid="transparent"
              blurOnSubmit={false}
            />
            <View style={styles.checkboxContainer}>
              <CheckBox
                title="NSFW"
                containerStyle={styles.checkbox}
                checkedColor={colors.green}
                checked={nsfw}
                checkedIcon="check-circle"
                uncheckedIcon="circle-thin"
                onPress={() => this.setState({ nsfw: !nsfw })}
              />
              <CheckBox
                title="Spoiler"
                containerStyle={styles.checkbox}
                checkedColor={colors.green}
                checked={spoiler}
                checkedIcon="check-circle"
                uncheckedIcon="circle-thin"
                onPress={() => this.setState({ spoiler: !spoiler })}
              />
            </View>
            <View>
              {media ?
                <MediaItem
                  disabled={busy}
                  media={media}
                  onClear={() => this.setState({ media: null })}
                />
                :
                <AdditionalButton
                  text="Tag Anime or Manga"
                  icon="tag"
                  color={colors.blue}
                  disabled={busy}
                  onPress={() => this.handleMediaPickerModal(true)}
                  style={styles.tagMedia}
                />
              }
              { gif ?
                <GIFImage
                  disabled={busy}
                  gif={gif}
                  onClear={() => this.setState({ gif: null })}
                />
                :
                <AdditionalButton
                  text="Search & Share Gif"
                  icon="plus"
                  color={colors.green}
                  disabled={busy}
                  onPress={() => this.handleGiphyPickerModal(true)}
                  style={styles.addGIF}
                />
              }
            </View>
          </ScrollView>
        </View>
        <GiphyModal
          visible={giphyPickerModalIsVisible}
          onCancelPress={() => this.handleGiphyPickerModal(false)}
          onGifSelect={this.handleGiphy}
        />
        <MediaModal
          visible={mediaPickerModalIsVisible}
          onCancelPress={() => this.handleMediaPickerModal(false)}
          onMediaSelect={this.handleMedia}
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
