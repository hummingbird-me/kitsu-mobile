import React from 'react';
import { KeyboardAvoidingView, View, Text, ScrollView, Platform, TouchableOpacity, Keyboard, BackHandler, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import { isEmpty, isNil, isNull } from 'lodash';
import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar, ACCEPTED_UPLOAD_TYPES } from 'kitsu/constants/app';
import { ModalHeader } from 'kitsu/screens/Feed/components/ModalHeader';
import * as colors from 'kitsu/constants/colors';
import { PostMeta } from 'kitsu/screens/Feed/components/PostMeta';
import { PostTextInput } from 'kitsu/screens/Feed/components/PostTextInput';
import { GiphyModal } from 'kitsu/screens/Feed/components/GiphyModal';
import { MediaModal } from 'kitsu/screens/Feed/components/MediaModal';
import { feedStreams } from 'kitsu/screens/Feed/feedStreams';
import { ImageUploader } from 'kitsu/utils/imageUploader';
import { kitsuConfig } from 'kitsu/config/env';
import ImagePicker from 'react-native-image-crop-picker';
import { ImageGrid } from 'kitsu/screens/Feed/components/ImageGrid';
import { ImageSortModal } from 'kitsu/screens/Feed/components/ImageSortModal';
import { giphy, photo, tag } from 'kitsu/assets/img/post-creation';
import { prettyBytes } from 'kitsu/utils/prettyBytes';
import Icon from 'react-native-vector-icons/Ionicons';
import { extractUrls } from 'kitsu/utils/url';
import * as Sentry from '@sentry/react-native';
import { CheckBox } from 'kitsu/components/Checkbox';
import { MediaItem } from './components/MediaItem';
import { EmbedItem } from './components/EmbedItem';
import { styles } from './styles';
import { EmbedModal } from './components/EmbedModal';

// Maximum number of images that are allowed to be uploaded
const MAX_UPLOAD_COUNT = 20;

// Maximum upload limit (20mb)
const MAX_UPLOAD_SIZE_LIMIT = 20000000;

interface PostCreatorProps {
  // Whether to apply `KeyboardAvoidingView` to the component
  // Sometimes on android devices having this set to `true` will cause the component to mess up rendering
  // So it's best to test and disable if needed
  // In our case it messes up when you make this component a child of a `Modal`.
  avoidKeyboard?: boolean;
  // The current user - provided by redux
  currentUser: object;
  // Whether to hide the PostMeta header
  hideMeta?: boolean;
  // Allow user to select media
  disableMedia?: boolean;
  // Stlye of the editor container view (everything except header)
  editorContainerStyle?: object;
  // The media to associate with the post
  // Leave this blank if you're passing in `post` prop.
  media?: object;
  // Mark post as NSFW?
  nsfw?: boolean;
  // Callback handler for when 'Cancel' is pressed.
  onCancel?(...args: unknown[]): unknown;
  // Callback handler for when post is created. The new post is passed back in this callback.
  onPostCreated?(...args: unknown[]): unknown;
  // The placeholder text to use
  placeholder?: string;
  // A post object
  // If this is set then it is assummed that we are editing instead of creating
  // This will automatically populate: content, uploads, media, nsfw and spoiler
  post?: object;
  // A function to render a custom header
  // This will pass in: busy, isEditing, onPostPress, onCancel
  // Leave blank for default implementation
  renderHeader?(...args: unknown[]): unknown;
  // The spoiled unit(episode/chapter) to apply to the post
  spoiledUnit?: object;
  // Mark post as Spoiler?
  spoiler?: boolean;
  // Main container style
  style?: object;
  // The user we are targetting in the post
  targetUser?: object;
}

class PostCreator extends React.PureComponent<PostCreatorProps> {
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
      content: post.originalContent || post.content || '',
      uploads: sortedUploads,
      media: post.media || props.media || null,
      nsfw: post.nsfw || props.nsfw || false,
      spoiler: post.spoiler || props.spoiler || false,
      spoiledUnit: post.spoiledUnit || props.spoiledUnit || null,
      currentFeed: feedStreams[0],
      error: '',
      uploading: false,
      progress: { loaded: 0, total: 1 },
      giphyPickerModalIsVisible: false,
      mediaPickerModalIsVisible: false,
      imageSortModalIsVisible: false,
      embedModalIsVisible: false,
      actionBarExpanded: false,
      busy: false,

      // This is null when a user hasn't set an embed (we can auto generate embed)
      // OR it will be ''(empty) if user chose to set no embed.
      currentEmbedUrl: (post.embed && post.embed.url) || null,
    };
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    // Abort any uploading if user cancels
    if (this.uploader) {
      this.uploader.abort();
    }
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    ImagePicker.clean();
    Keyboard.dismiss();
  }

  getUploadsSize() {
    return (this.state.uploads || []).reduce((size, current) => {
      return size + (current.size || 0);
    }, 0);
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
    if (gif && gif.id) {
      const gifURL = `https://media.giphy.com/media/${gif.id}/giphy.gif`;
      const content = `${this.state.content}\n${gifURL}`.trim();
      this.setState({ content, currentEmbedUrl: gifURL });
    }
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

  handleEmbedModal = (embedModalIsVisible) => {
    this.setState({ embedModalIsVisible });
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

    // Don't allow uploading if we can't
    if (!this.canUploadImages()) return;

    // Only allow user to select upto the maximum upload count
    // Also cap it to the max value of images they can still upload
    // E.g max uploads = 20
    // If user has chose 4 images, then when they choose the next, they can only select 16
    const maxFiles = Math.max(0, MAX_UPLOAD_COUNT - (this.state.uploads || []).length);

    try {
      this.pickerShown = true;
      const images = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: true,
        maxFiles,
        compressImageMaxWidth: 2000,
        compressImageMaxHeight: 2000,
        compressImageQuality: 0.8,
        compressGIF: false,
      });

      this.pickerShown = false;

      const uploads = images.map(image => ({
        ...image,
        uri: image.path,
      }));

      // Properties needed for filters below
      let currentSize = this.getUploadsSize();
      const idKey = Platform.select({ ios: 'sourceURL', android: 'uri' });
      const currentUploads = this.state.uploads.map(u => u[idKey]);

      const filtered = uploads.filter((u) => {
        // Remove any image types that we don't accept
        const mime = u.mime || '';
        const validType = ACCEPTED_UPLOAD_TYPES.includes(mime.toLowerCase().trim());

        // Disallow submitting the same image twice
        const duplicateUpload = currentUploads.includes(u[idKey]);

        return validType && !duplicateUpload;
      }).filter((i) => {
        // Filter out images that don't fit into our size limit
        const imageSize = i.size;
        const imageWithinSizeLimit = !!(imageSize && imageSize + currentSize <= MAX_UPLOAD_SIZE_LIMIT);

        if (imageWithinSizeLimit) currentSize += imageSize;
        return imageWithinSizeLimit;
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
    const { busy, content, currentFeed, media, nsfw, spoiler, spoiledUnit, uploads, currentEmbedUrl } = this.state;

    const currentUserId = currentUser && currentUser.id;
    const isEditing = !isEmpty(post);

    if (busy) return;

    // Work out the embed which we want to use
    const trimmed = content.trim();
    const urls = extractUrls(trimmed);
    const defaultEmbed = (!isEmpty(urls) && urls[0]) || null;
    let embedUrl = isNull(currentEmbedUrl) ? defaultEmbed : currentEmbedUrl;

    // Don't embed if uploads are set
    if (uploads.length > 0) {
      embedUrl = null;
    }

    if (isEmpty(embedUrl) && uploads.length === 0 && isEmpty(trimmed)) {
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

        Sentry.captureMessage('Failed to upload images', {
          tags: {
            type: 'image_upload',
          },
          extra: {
            error: JSON.stringify(e),
            text: JSON.stringify(e && e.error),
          },
        });
        return;
      }
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
              uploadOrder: index + 1,
            })
          )));
        }

        // Update post
        newPost = await Kitsu.update('posts', {
          id: post.id,
          content: trimmed,
          nsfw,
          spoiler,
          embedUrl,
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
          content: trimmed,
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
          embedUrl,
        }, {
          include: 'media,spoiledUnit,user,uploads',
        });
      }

      // Clean up any tmp image files
      ImagePicker.clean();

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
    const { media } = this.state;
    const isEditing = !isEmpty(post);

    // Can only set media if it hasn't been set or it is disabled
    const canSetMedia = !(media || disableMedia);

    // Can only set uploads if we're not editing and user hasn't hit max count
    const canSetUploads = !isEditing && this.canUploadImages();

    return {
      canSetMedia,
      canSetUploads,
    };
  }

  canUploadImages() {
    const { uploads } = this.state;
    const currentSize = this.getUploadsSize();
    return (uploads.length < MAX_UPLOAD_COUNT) && (currentSize < MAX_UPLOAD_SIZE_LIMIT);
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

  renderUpload() {
    const { uploads, busy } = this.state;

    if (isEmpty(uploads)) return null;

    const size = this.getUploadsSize();

    return (
      <View style={styles.uploadContainer}>
        <ImageGrid
          images={uploads.map(u => (u.uri || (u.content && u.content.original)))}
          compact
          onImageTapped={() => this.handleImageSortModal(true)}
          disabled={busy}
        />
        { size > 0 &&
          <View style={styles.imageSizeContainer}>
            <Text numberOfLines={1}>
              Size: {prettyBytes(size)}
            </Text>
          </View>
        }
      </View>
    );
  }

  renderEmbed() {
    const { content, currentEmbedUrl, embedModalIsVisible, busy } = this.state;

    const urls = extractUrls(content);

    // If user has chose to not embed anything and they clear the textinput completely
    // We need to reset the state
    if (isEmpty(urls) && currentEmbedUrl === '') {
      this.setState({ currentEmbedUrl: null });
    }

    // Only show embed if we have urls or an embed already
    if (isEmpty(urls) && isNull(currentEmbedUrl)) return null;

    // Use either the current embed or the first url
    const embed = isNull(currentEmbedUrl) ? urls[0] : currentEmbedUrl;
    const validEmbed = !isEmpty(embed);

    /*
      Show change embed button IF:
        - We have more than 1 url to show
        OR
        - Current Embed url is different from the first url
          * For the case where user chooses an embed and then clears out the url, we need to still allow them to choose another embed.
    */
    const isCurrentEmbedDifferent = !isNull(currentEmbedUrl) && urls.length > 0 && currentEmbedUrl !== urls[0];
    const showChangeEmbed = urls.length > 1 || isCurrentEmbedDifferent;

    return (
      <View style={styles.embed}>
        {validEmbed ?
          <EmbedItem url={embed} />
          :
          <View style={styles.emptyEmbed}>
            <Text style={styles.emptyEmbedText}>No Embed Selected</Text>
          </View>
        }
        <View style={styles.embedOptions}>
          {showChangeEmbed &&
            <TouchableOpacity
              style={[styles.embedText, validEmbed && { marginRight: 4 }]}
              onPress={() => this.handleEmbedModal(true)}
              disabled={busy}
            >
              <Text>Change Embed</Text>
            </TouchableOpacity>
          }
          {validEmbed &&
            <TouchableOpacity
              style={[styles.embedText, styles.clearEmbed]}
              onPress={() => {
                // If user clears embed and we don't have any other url to pick, then we reset the state
                const url = isEmpty(urls) ? null : '';
                this.setState({ currentEmbedUrl: url });
              }}
              disabled={busy}
            >
              <Text style={{ color: 'white' }}>Clear Embed</Text>
            </TouchableOpacity>
          }
        </View>
        <EmbedModal
          visible={embedModalIsVisible}
          onCancelPress={() => this.handleEmbedModal(false)}
          onEmbedSelect={(url) => {
            const state = { embedModalIsVisible: false };
            if (url) state.currentEmbedUrl = url;
            this.setState(state);
          }}
          urls={[currentEmbedUrl, ...urls]}
          currentEmbed={embed}
        />
      </View>
    );
  }

  renderActionBarModal() {
    const { busy } = this.state;
    if (busy) return null;

    const actions = this.canSetActions();
    const data = [
      {
        image: photo,
        color: colors.red,
        title: `Attach Photos (Max ${prettyBytes(MAX_UPLOAD_SIZE_LIMIT)} or ${MAX_UPLOAD_COUNT} Images)`,
        onPress: () => this.handlePressUpload(),
        visible: actions.canSetUploads,
      },
      {
        image: giphy,
        color: '#8ABE53',
        title: 'Search & Share GIF',
        onPress: () => this.handleGiphyPickerModal(true),
        visible: true,
      },
      {
        image: tag,
        color: colors.blue,
        title: 'Tag Anime or Manga',
        onPress: () => this.handleMediaPickerModal(true),
        visible: actions.canSetMedia,
      },
    ].filter(d => d.visible);

    // Don't show if nothing can be selected
    if (isEmpty(data)) return null;

    const dismiss = () => this.handleActionBarExpand(false);

    return (
      <TouchableOpacity
        style={styles.actionModalContainer}
        onPress={dismiss}
        activeOpacity={0.9}
      >
        <View style={styles.actionModalCancelContainer}>
          <TouchableOpacity style={styles.actionModalCancel} onPress={dismiss}>
            <Icon name="md-close" style={styles.actionModalCancelIcon} />
            <Text style={styles.actionModalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: colors.white }}>
          {data.map(item => this.renderActionModalItem(item))}
        </View>
      </TouchableOpacity>
    );
  }

  renderActionModalItem = (item) => {
    const { image, title, onPress } = item;
    return (
      <TouchableOpacity key={title} style={styles.actionModalItem} onPress={onPress}>
        <Image style={styles.actionModalImage} source={image} resizeMode="contain" />
        <Text style={styles.actionBarText}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  renderActionBar() {
    const { busy } = this.state;
    const actions = this.canSetActions();

    const data = [
      {
        image: photo,
        visible: actions.canSetUploads,
      },
      {
        image: giphy,
        visible: true,
      },
      {
        image: tag,
        visible: actions.canSetMedia,
      },
    ].filter(d => d.visible);

    // Don't render anything if nothing can be set
    if (isEmpty(data)) return null;

    return (
      <TouchableOpacity
        style={styles.actionBar}
        disabled={busy}
        onPress={() => this.handleActionBarExpand(true)}
      >
        <Text style={styles.actionBarText} numberOfLines={1}>
          Add to your post
        </Text>
        <View style={styles.actionBarImages}>
          {data.map(item => (
            <Image source={item.image} resizeMode="contain" style={styles.actionBarImage} />
          ))}
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

            {/* UI for media, embeds and uploads */}
            <View>
              { this.renderMedia() }

              {/* Don't allow embeds if user is uploading images */}
              { isEmpty(uploads) && this.renderEmbed() }

              { this.renderUpload() }
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
          disableAddButton={isEditing || !this.canUploadImages()}
          disableRemoveButton={isEditing}
          maxUploadSize={MAX_UPLOAD_SIZE_LIMIT}
          currentImagesSize={this.getUploadsSize()}
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
