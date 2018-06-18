import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, View, Text, ScrollView, Platform } from 'react-native';
import { connect } from 'react-redux';
import { isEmpty, isNil } from 'lodash';
import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar, ACCEPTED_UPLOAD_TYPES } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { PostMeta } from 'kitsu/screens/Feed/components/PostMeta';
import { PostTextInput } from 'kitsu/screens/Feed/components/PostTextInput';
import { HeaderButton } from 'kitsu/screens/Feed/components/HeaderButton';
import { GiphyModal } from 'kitsu/screens/Feed/components/GiphyModal';
import { MediaModal } from 'kitsu/screens/Feed/components/MediaModal';
import { feedStreams } from 'kitsu/screens/Feed/feedStreams';
import { CheckBox } from 'react-native-elements';
import { ImageUploader } from 'kitsu/utils/imageuploader';
import { kitsuConfig } from 'kitsu/config/env';
import ImagePicker from 'react-native-image-crop-picker';
import { ImageGrid } from 'kitsu/screens/Feed/components/ImageGrid';
import { ImageSortModal } from 'kitsu/screens/Feed/components/ImageSortModal';
import { prettyBytes } from 'kitsu/utils/prettyBytes';
import { GIFImage } from './GIFImage';
import { AdditionalButton } from './AdditionalButton';
import { MediaItem } from './MediaItem';
import { createPostStyles as styles } from './styles';

// Maximum number of images that are allowed to be uploaded
const MAX_UPLOAD_COUNT = 20;

class CreatePost extends React.PureComponent {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: params.isEditing ? 'Edit Post' : 'Create Post',
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
          title={params.isEditing ? 'Edit' : 'Post'}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.uploader = new ImageUploader(kitsuConfig.uploadUrl);
  }

  state = {
    giphyPickerModalIsVisible: false,
    mediaPickerModalIsVisible: false,
    imageSortModalIsVisible: false,
    content: '',
    currentFeed: feedStreams[0],
    error: '',
    gif: null,
    uploads: [],
    media: this.props.navigation.state.params.media || null,
    nsfw: this.props.navigation.state.params.nsfw || false,
    spoiler: this.props.navigation.state.params.spoiler || false,
    spoiledUnit: this.props.navigation.state.params.spoiledUnit || null,
    uploading: false,
    progress: { loaded: 0, total: 1 },
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      handlePressPost: this.handlePressPost,
      busy: false,
    });

    // Editing an existing post?
    const { state: { params } } = navigation;
    if (!params.isEditing) { return; }
    const { post } = params;
    const sortedUploads = (post.uploads || []).sort((a, b) => (a.uploadOrder - b.uploadOrder));
    this.setState({
      content: post.content,
      spoiler: post.spoiler || false,
      nsfw: post.nsfw || false,
      media: post.media,
      uploads: sortedUploads,
    });
  }

  componentWillUnmount() {
    // Abort any uploading if user cancels
    if (this.uploader) {
      this.uploader.abort();
    }
  }

  pickerShown = false;

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

  handleImageSortModal = (imageSortModalIsVisible) => {
    this.setState({ imageSortModalIsVisible });
  }

  handlePressUpload = async () => {
    if (this.pickerShown) return;

    // Don't show upload if user is editing post
    if (this.props.navigation.state.params.isEditing) return;

    // Don't allow more uploads than neccessary
    if (this.state.uploads.length >= MAX_UPLOAD_COUNT) return;

    try {
      this.pickerShown = true;
      const images = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: true,
        compressImageMaxWidth: 2000,
        compressImageMaxHeight: 2000,
        compressImageQuality: 0.8,
      });

      this.pickerShown = false;

      const uploads = images.map(image => ({
        ...image,
        uri: image.path,
      }));

      // Properties needed for filters below
      const idKey = Platform.select({ ios: 'sourceURL', android: 'uri' });
      const currentUploads = this.state.uploads.map(u => u[idKey]);

      const filtered = uploads.filter((u) => {
        // Remove any image types that we don't accept
        const mime = u.mime || '';
        const validType = ACCEPTED_UPLOAD_TYPES.includes(mime.toLowerCase().trim());

        // Disallow submitting the same image twice
        const duplicateUpload = currentUploads.includes(u[idKey]);

        return validType && !duplicateUpload;
      });

      // Only update if we have uploads to add
      if (!isEmpty(filtered)) {
        // Make sure we don't go over the upload limit
        const clipped = [
          ...this.state.uploads,
          ...filtered,
        ].splice(0, MAX_UPLOAD_COUNT);

        this.setState({
          uploads: clipped,
        });
      }
    } catch (e) {
      this.pickerShown = false;
      console.log(e);
    }
  }

  handlePressPost = async () => {
    const { navigation } = this.props;
    const { targetUser, busy, isEditing, onNewPostCreated } = navigation.state.params;
    const currentUserId = this.props.currentUser.id;
    const { content, currentFeed, gif, media, nsfw, spoiler, spoiledUnit, uploads } = this.state;

    if (busy) return;

    // Don't allow posting if content and gif is empty
    if (isEmpty(content)) {
      this.setState({ error: 'No content provided!' });
      return;
    }

    navigation.setParams({ busy: true });
    this.setState({ error: '' });

    // Upload images if we're not editing
    let kitsuUploads = null;
    if (!isEditing && !isEmpty(uploads)) {
      try {
        this.setState({ uploading: true });
        const response = await this.uploader.upload(uploads, (progress) => {
          this.setState({
            progress: {
              loaded: progress.loaded,
              total: progress.total,
            },
          });
        });

        // Get the upload data
        const json = JSON.parse(response);
        kitsuUploads = json.data;

        this.setState({ uploading: false });
      } catch (e) {
        console.log(e);
        this.uploader.abort();

        // Show the error to the user
        const error = e && e.error;
        const errorText = !isEmpty(error) ? `- ${error}` : '';
        navigation.setParams({ busy: false });
        this.setState({
          error: `Failed to upload images ${errorText}`,
          uploading: false,
        });
        return;
      }
    }

    // Add the gif to the content
    let additionalContent = content;
    if (gif && gif.id) {
      const gifURL = `https://media.giphy.com/media/${gif.id}/giphy.gif`;
      additionalContent += `\n${gifURL}`;
    }

    const mediaData = media ? {
      media: {
        id: media.id,
        type: media.kind || media.type,
      },
    } : {};

    const spoiledData = spoiledUnit ? {
      spoiledUnit: {
        id: spoiledUnit.id,
        type: spoiledUnit.type,
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

    // Post uploads
    const postUploads = kitsuUploads ? {
      uploads: kitsuUploads.map(upload => ({
        type: 'uploads',
        id: upload.id,
      })),
    } : {};

    let post = null;
    try {
      if (isEditing) {
        // Update the order of images
        // This can be done because we don't allow additions/deletions when editing
        if (!isEmpty(uploads)) {
          await Promise.all(uploads.map((upload, index) => (
            Kitsu.update('uploads', {
              id: upload.id,
              uploadOrder: index,
            })
          )));
        }

        // Update post
        post = await Kitsu.update('posts', {
          id: navigation.state.params.post.id,
          content: additionalContent,
          nsfw,
          spoiler,
        }, {
          // We need to get the new uploads with their new order
          include: 'uploads',
        });
      } else {
        post = await Kitsu.create('posts', {
          content: additionalContent,
          ...targetInterestData,
          user: {
            type: 'users',
            id: currentUserId,
          },
          ...postUploads,
          ...targetData,
          ...mediaData,
          nsfw,
          spoiler,
          ...spoiledData,
        });
      }

      if (onNewPostCreated) {
        onNewPostCreated(post);
      }

      navigation.goBack();
    } catch (err) {
      const string = (err && err[0].detail) || 'Failed to create post.';
      this.setState({ error: string });
    }

    navigation.setParams({ busy: false });
  }

  swapImages = (current, next) => {
    const newUploads = this.state.uploads;

    // Swap items at index current and next
    const tmp = newUploads[current];
    newUploads[current] = newUploads[next];
    newUploads[next] = tmp;

    this.setState({ uploads: [...newUploads] });
  }

  removeImage = (index) => {
    const newUploads = this.state.uploads;
    newUploads.splice(index, 1);
    this.setState({ uploads: [...newUploads] });
  }

  renderUploadProgress() {
    const { uploading, progress } = this.state;

    if (!uploading) return null;

    const { loaded, total } = progress;

    // Convert values to human readable values
    const prettyLoaded = prettyBytes(loaded);
    const prettyTotal = prettyBytes(total);

    // Text stuff
    const progressText = `(${prettyLoaded}/${prettyTotal})`;
    const percentage = total > 0 ? Math.round((loaded / total) * 100) : null;

    // Show progress display as: 10% (10kB/100kB)
    const percentageText = isNil(percentage) ? '' : `- ${percentage}% ${progressText}`;

    return (
      <View style={styles.uploadProgressContainer}>
        <Text style={{ color: 'white' }} numberOfLines={1}>
          Uploading Images {percentageText}
        </Text>
      </View>
    );
  }

  renderError() {
    const { error } = this.state;
    if (isEmpty(error)) return null;

    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: 'white' }} numberOfLines={1}>
          Error: {error}
        </Text>
      </View>
    );
  }

  renderMedia() {
    const { media } = this.state;
    const { busy, isEditing, isMediaDisabled } = this.props.navigation.state.params;

    if (media) {
      return (
        <MediaItem
          disabled={busy || isEditing || isMediaDisabled}
          media={media}
          onClear={() => this.setState({ media: null })}
        />
      );
    }

    return (
      <AdditionalButton
        text="Tag Anime or Manga"
        icon="tag"
        color={colors.blue}
        disabled={busy || isEditing}
        onPress={() => this.handleMediaPickerModal(true)}
        style={styles.tagMedia}
      />
    );
  }

  renderGIF() {
    const { gif } = this.state;
    const { busy } = this.props.navigation.state.params;

    if (gif) {
      return (
        <GIFImage
          disabled={busy}
          gif={gif}
          onClear={() => this.setState({ gif: null })}
        />
      );
    }

    return (
      <AdditionalButton
        text="Search & Share Gif"
        icon="plus"
        color={colors.green}
        disabled={busy}
        onPress={() => this.handleGiphyPickerModal(true)}
        style={styles.button}
      />
    );
  }

  renderUpload() {
    const { uploads } = this.state;
    const { busy } = this.props.navigation.state.params;

    if (!isEmpty(uploads)) {
      return (
        <View style={styles.uploadContainer}>
          <ImageGrid
            images={uploads.map(u => (u.uri || (u.content && u.content.original)))}
            compact
            onImageTapped={() => this.handleImageSortModal(true)}
            disabled={busy}
          />
        </View>
      );
    }

    return (
      <AdditionalButton
        text={`Upload Images (Max: ${MAX_UPLOAD_COUNT})`}
        icon="upload"
        color={colors.red}
        disabled={busy}
        onPress={this.handlePressUpload}
        style={styles.button}
      />
    );
  }

  render() {
    const { currentUser, navigation } = this.props;
    const {
      currentFeed,
      content,
      giphyPickerModalIsVisible,
      mediaPickerModalIsVisible,
      imageSortModalIsVisible,
      nsfw,
      spoiler,
      gif,
      uploads,
    } = this.state;
    const { targetUser, isEditing } = navigation.state.params;

    const isValidTargetUser = (targetUser && targetUser.id !== currentUser.id && targetUser.name);
    const placeholder = isValidTargetUser ? `Write something to ${targetUser.name}` : 'Write something....';

    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.main}
      >
        <View style={styles.flex}>
          {/* Upload  */}
          {this.renderUploadProgress()}
          { /* Error */}
          {this.renderError()}
          {/* Meta */}
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
              { this.renderMedia() }

              {/* Don't allow gif selection if user is uploading images */}
              { isEmpty(uploads) && this.renderGIF() }

              {/* Only allow uploading if gif is not selected */}
              { !gif &&
                this.renderUpload()
              }
            </View>
          </ScrollView>
        </View>
        <ImageSortModal
          images={uploads}
          visible={imageSortModalIsVisible}
          onCancelPress={() => this.handleImageSortModal(false)}
          onAddPress={this.handlePressUpload}
          onChangeImageOrder={this.swapImages}
          onRemoveImage={this.removeImage}
          disableAddButton={isEditing || (uploads.length >= MAX_UPLOAD_COUNT)}
          disableRemoveButton={isEditing}
        />
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
