import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, View, Text, ScrollView, Platform, TouchableOpacity, Keyboard, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { isEmpty, isNil } from 'lodash';
import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar, ACCEPTED_UPLOAD_TYPES } from 'kitsu/constants/app';
import { ModalHeader } from 'kitsu/screens/Feed/components/ModalHeader';
import * as colors from 'kitsu/constants/colors';
import { PostMeta } from 'kitsu/screens/Feed/components/PostMeta';
import { PostTextInput } from 'kitsu/screens/Feed/components/PostTextInput';
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
import Icon from 'react-native-vector-icons/FontAwesome';
import { GIFImage } from './GIFImage';
import { MediaItem } from './MediaItem';
import { createPostStyles as styles } from './styles';

// Maximum number of images that are allowed to be uploaded
const MAX_UPLOAD_COUNT = 20;

class PostCreator extends React.PureComponent {
  static propTypes = {
    // Whether to apply `KeyboardAvoidingView` to the component
    // Sometimes on android devices having this set to `true` will cause the component to mess up rendering
    // So it's best to test and disable if needed
    // In our case it messes up when you make this component a child of a `Modal`.
    avoidKeyboard: PropTypes.bool,

    // The current user - provided by redux
    currentUser: PropTypes.object.isRequired,

    // Whether to hide the PostMeta header
    hideMeta: PropTypes.bool,

    // Allow user to select media
    disableMedia: PropTypes.bool,

    // Stlye of the editor container view (everything except header)
    editorContainerStyle: PropTypes.object,

    // The media to associate with the post
    // Leave this blank if you're passing in `post` prop.
    media: PropTypes.object,

    // Mark post as NSFW?
    nsfw: PropTypes.bool,

    // Callback handler for when 'Cancel' is pressed.
    onCancel: PropTypes.func,

    // Callback handler for when post is created. The new post is passed back in this callback.
    onPostCreated: PropTypes.func,

    // The placeholder text to use
    placeholder: PropTypes.string,

    // A post object
    // If this is set then it is assummed that we are editing instead of creating
    // This will automatically populate: content, uploads, media, nsfw and spoiler
    post: PropTypes.object,

    // A function to render a custom header
    // This will pass in: busy, isEditing, onPostPress, onCancel
    // Leave blank for default implementation
    renderHeader: PropTypes.func,

    // The spoiled unit(episode/chapter) to apply to the post
    spoiledUnit: PropTypes.object,

    // Mark post as Spoiler?
    spoiler: PropTypes.bool,

    // Main container style
    style: PropTypes.object,

    // The user we are targetting in the post
    targetUser: PropTypes.object,
  }

  static defaultProps = {
    avoidKeyboard: true,
    hideMeta: false,
    disableMedia: false,
    editorContainerStyle: null,
    media: null,
    nsfw: false,
    onCancel: null,
    onPostCreated: null,
    placeholder: null,
    post: null,
    renderHeader: null,
    spoiledUnit: null,
    spoiler: false,
    style: null,
    targetUser: null,
  }

  constructor(props) {
    super(props);
    this.uploader = new ImageUploader(kitsuConfig.uploadUrl);

    const post = props.post || {};
    const sortedUploads = (post.uploads || []).sort((a, b) => (a.uploadOrder - b.uploadOrder));

    this.state = {
      content: post.content || '',
      uploads: sortedUploads,
      media: post.media || props.media || null,
      nsfw: post.nsfw || props.nsfw || false,
      spoiler: post.spoiler || props.spoiler || false,
      spoiledUnit: post.spoiledUnit || props.spoiledUnit || null,
      currentFeed: feedStreams[0],
      error: '',
      gif: null,
      uploading: false,
      progress: { loaded: 0, total: 1 },
      giphyPickerModalIsVisible: false,
      mediaPickerModalIsVisible: false,
      imageSortModalIsVisible: false,
      actionBarExpanded: false,
      busy: false,
    };
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    // Abort any uploading if user cancels
    if (this.uploader) {
      this.uploader.abort();
    }
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  pickerShown = false;

  handleBackPress = () => {
    // This is for handling hardware back button presses on android
    // NOTE: This won't trigger if component is inside a `Modal` since it overrides it.
    if (this.state.actionBarExpanded) {
      this.handleActionBarExpand(false);
      return true;
    }

    return false;
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
    this.setState({ mediaPickerModalIsVisible, actionBarExpanded: false });
  }

  handleGiphyPickerModal = (giphyPickerModalIsVisible) => {
    this.setState({ giphyPickerModalIsVisible, actionBarExpanded: false });
  }

  handleImageSortModal = (imageSortModalIsVisible) => {
    this.setState({ imageSortModalIsVisible, actionBarExpanded: false });
  }

  handleActionBarExpand = (actionBarExpanded) => {
    Keyboard.dismiss();
    this.setState({ actionBarExpanded });
  }

  handlePressUpload = async () => {
    this.handleActionBarExpand(false);
    if (this.pickerShown) return;

    // Don't show upload if user is editing post
    if (!isEmpty(this.props.post)) return;

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
    const { targetUser, post, onPostCreated, currentUser } = this.props;
    const { busy, content, currentFeed, gif, media, nsfw, spoiler, spoiledUnit, uploads } = this.state;

    const currentUserId = currentUser && currentUser.id;
    const isEditing = !isEmpty(post);

    if (busy) return;

    // Don't allow posting if content and gif is empty
    if (isEmpty(content)) {
      this.setState({ error: 'Please add a message to your post' });
      return;
    }

    this.setState({ busy: true, error: '' });

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
        this.setState({
          busy: false,
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

    let newPost = null;
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
        newPost = await Kitsu.update('posts', {
          id: post.id,
          content: additionalContent,
          nsfw,
          spoiler,
        }, {
          // We need to get the new uploads with their new order
          include: 'uploads',
        });

        // Link post relationships
        newPost.user = post.user;
        newPost.targetUser = post.targetUser;
        newPost.spoiledUnit = post.spoiledUnit;
        newPost.media = post.media;
        newPost.targetGroup = post.targetGroup;
      } else {
        newPost = await Kitsu.create('posts', {
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
        }, {
          include: 'media,spoiledUnit,user,uploads',
        });
      }

      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (err) {
      const string = (err && err[0].detail) || 'Failed to create post.';
      this.setState({ error: string });
    }

    this.setState({ busy: false });
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

  canSetActions() {
    const { post, disableMedia } = this.props;
    const { gif, uploads, media } = this.state;
    const isEditing = !isEmpty(post);

    // Can only set media if it hasn't been set or it is disabled
    const canSetMedia = !(media || disableMedia);

    // Can only set uploads if we're not editing and user hasn't hit max count or gif isn't set
    const canSetUploads = (!gif && !isEditing && uploads.length < MAX_UPLOAD_COUNT);

    // Can only set gif if user hasn't uploaded anything
    const canSetGIF = !gif && isEmpty(uploads);

    return {
      canSetMedia,
      canSetUploads,
      canSetGIF,
    };
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

  renderCheckboxes() {
    const { nsfw, spoiler } = this.state;
    return (
      <View style={styles.checkboxContainer}>
        <CheckBox
          title="NSFW"
          containerStyle={[styles.checkbox, { marginRight: 0 }, nsfw && styles.checkbox_checked]}
          textStyle={nsfw && { color: 'white' }}
          checkedColor={colors.white}
          checked={nsfw}
          checkedIcon="check-circle"
          uncheckedIcon="circle-thin"
          onPress={() => this.setState({ nsfw: !nsfw })}
        />
        <CheckBox
          title="Spoiler"
          containerStyle={[styles.checkbox, spoiler && styles.checkbox_checked]}
          checkedColor={colors.white}
          textStyle={spoiler && { color: 'white' }}
          checked={spoiler}
          checkedIcon="check-circle"
          uncheckedIcon="circle-thin"
          onPress={() => this.setState({ spoiler: !spoiler })}
        />
      </View>
    );
  }

  renderMedia() {
    const { media, busy, spoiledUnit } = this.state;
    const { post, disableMedia } = this.props;
    const isEditing = !isEmpty(post);

    if (!media) return null;

    return (
      <MediaItem
        disabled={busy || isEditing || disableMedia}
        media={media}
        episode={spoiledUnit}
        onClear={() => this.setState({ media: null })}
      />
    );
  }

  renderGIF() {
    const { gif, busy } = this.state;

    if (!gif) return null;

    return (
      <GIFImage
        disabled={busy}
        gif={gif}
        onClear={() => this.setState({ gif: null })}
      />
    );
  }

  renderUpload() {
    const { uploads, busy } = this.state;

    if (isEmpty(uploads)) return null;

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

  renderActionBarModal() {
    const { busy } = this.state;
    if (busy) return null;

    const actions = this.canSetActions();
    return (
      <TouchableOpacity
        style={styles.actionModalContainer}
        onPress={() => this.handleActionBarExpand(false)}
        activeOpacity={0.9}
      >
        <View style={{ backgroundColor: 'white' }}>
          {actions.canSetUploads &&
            this.renderActionModalItem('folder-open', colors.red, `Attach Photos (max ${MAX_UPLOAD_COUNT})`, () => {
              this.handlePressUpload();
            })
          }
          {actions.canSetGIF &&
            this.renderActionModalItem('image', '#8ABE53', 'Search & Share GIF', () => {
              this.handleGiphyPickerModal(true);
            })
          }
          {actions.canSetMedia &&
            this.renderActionModalItem('tag', colors.blue, 'Tag Anime or Manga', () => {
              this.handleMediaPickerModal(true);
            })
          }
          {
            this.renderActionModalItem('times', colors.red, 'Cancel', () => {
              this.handleActionBarExpand(false);
            })
          }
        </View>
      </TouchableOpacity>
    );
  }

  renderActionModalItem = (icon, color, text, onPress) => (
    <TouchableOpacity style={styles.actionModalItem} onPress={onPress}>
      <View style={styles.actionModalIconContainer}>
        <Icon name={icon} color={color} style={styles.actionModalIcon} />
      </View>
      <Text style={styles.actionBarText}>
        {text}
      </Text>
    </TouchableOpacity>
  )

  renderActionBar() {
    const { busy } = this.state;
    const actions = this.canSetActions();

    // Don't render anything if nothing can be set
    if (!actions.canSetMedia && !(actions.canSetUploads || actions.canSetGIF)) return null;

    return (
      <TouchableOpacity
        style={styles.actionBar}
        disabled={busy}
        onPress={() => this.handleActionBarExpand(true)}
      >
        <Text style={styles.actionBarText} numberOfLines={1}>
          Add to your post
        </Text>
        <View style={styles.actionBarIcons}>
          {actions.canSetUploads &&
            <Icon name="folder-open" color={colors.red} style={styles.actionBarIcon} />
          }
          {actions.canSetGIF &&
            <Icon name="image" color={'#8ABE53'} style={styles.actionBarIcon} />
          }
          {actions.canSetMedia &&
            <Icon name="tag" color={colors.blue} style={styles.actionBarIcon} />
          }
        </View>
      </TouchableOpacity>
    );
  }

  renderHeader = (busy, isEditing, onPostPress, onCancel) => (
    <ModalHeader
      title={isEditing ? 'Edit Post' : 'Create Post'}
      leftButtonTitle="Cancel"
      leftButtonAction={onCancel}
      rightButtonTitle={isEditing ? 'Edit' : 'Post'}
      rightButtonAction={onPostPress}
      rightButtonDisabled={busy}
      rightButtonLoading={busy}
      style={styles.header}
    />
  );

  render() {
    const {
      currentUser,
      targetUser,
      post,
      hideMeta,
      placeholder: propPlaceholder,
      renderHeader: propHeaderRender,
      onCancel,
      style,
      editorContainerStyle,
      avoidKeyboard,
    } = this.props;

    const {
      currentFeed,
      content,
      giphyPickerModalIsVisible,
      mediaPickerModalIsVisible,
      imageSortModalIsVisible,
      gif,
      uploads,
      busy,
      actionBarExpanded,
    } = this.state;

    const isEditing = !isEmpty(post);
    const isValidTargetUser = (currentUser && targetUser && targetUser.id !== currentUser.id && targetUser.name);

    // Placeholder text
    const defaultPlaceholder = isValidTargetUser ? `Write something to ${targetUser.name}` : 'Write something....';
    const placeholder = propPlaceholder || defaultPlaceholder;

    const renderHeader = propHeaderRender || this.renderHeader;
    const KeyboardView = avoidKeyboard ? KeyboardAvoidingView : View;

    return (
      <KeyboardView
        behavior="padding"
        style={[styles.main, style]}
      >
        {/* Header */}
        {renderHeader(busy, isEditing, this.handlePressPost, onCancel)}
        <View style={[styles.flex, editorContainerStyle]}>
          {/* Upload  */}
          {this.renderUploadProgress()}
          { /* Error */}
          {this.renderError()}
          {/* Meta */}
          {!hideMeta &&
            <PostMeta
              avatar={(currentUser.avatar && currentUser.avatar.medium) || defaultAvatar}
              author={currentUser.name}
              feedTitle={currentFeed.title}
              targetName={(isValidTargetUser && targetUser.name) || ''}
            />
          }
          <ScrollView
            style={[styles.flex, hideMeta && styles.padTop]}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {/* Text input */}
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

            {/* NSFW and Spoilers */}
            {this.renderCheckboxes()}

            {/* UI for media, gif and uploads */}
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

          {/* Action bar that users can press */}
          {actionBarExpanded && this.renderActionBarModal()}
          {this.renderActionBar()}
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
      </KeyboardView>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export default connect(mapStateToProps)(PostCreator);
