import { isEmpty, isNil, startCase, uniqBy } from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';

import emptyComment from 'kitsu/assets/img/quick_update/comment_empty.png';
import { ImageStatus } from 'kitsu/components/ImageStatus';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { StyledText, ViewMoreStyledText } from 'kitsu/components/StyledText';
import { Kitsu } from 'kitsu/config/api';
import * as colors from 'kitsu/constants/colors';
import { NavigationActions, Screens } from 'kitsu/navigation';
import { CreatePostRow } from 'kitsu/screens/Feed/components/CreatePostRow';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import { ErrorPage } from 'kitsu/screens/Profiles/components/ErrorPage';
import { SectionHeader } from 'kitsu/screens/Profiles/components/SectionHeader';
import { scenePadding } from 'kitsu/screens/Profiles/constants';
import { WebComponent } from 'kitsu/utils/components';
import { preprocessFeed } from 'kitsu/utils/preprocessFeed';

import { styles } from './styles';

const LANGUAGE_LOOKUP = {
  en: 'English',
  ja: 'Japanese',
  es: 'Spanish',
};
const ITEM_WIDTH = 50;

interface UnitProps {
  componentId: any;
  unit: object;
  media: object;
  currentUser?: object;
  shouldShowMediaCard?: boolean;
}

class Unit extends PureComponent<UnitProps> {
  static defaultProps = {
    currentUser: null,
    shouldShowMediaCard: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isFeedLoading: true,
      selectedUnit: props.unit,
      selectedVideoIndex: 0,
      discussions: [],
    };
  }

  componentDidMount() {
    this.fetchFeed();
  }

  fetchFeed = async () => {
    const { selectedUnit } = this.state;
    this.setState({ isFeedLoading: true });
    try {
      const feedType =
        selectedUnit.type === 'episodes' ? 'episodeFeed' : 'chapterFeed';
      const posts = await Kitsu.find(feedType, selectedUnit.id, {
        include:
          'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry,subject.anime,subject.manga,subject.uploads,target.uploads',
        filter: { kind: 'posts' },
        page: { limit: 10 },
      });
      const discussions = uniqBy(preprocessFeed(posts), 'id');
      this.setState({ discussions, isFeedLoading: false });
    } catch (error) {
      console.log('Failed to fetch feed:', error);
      this.setState({ discussions: [], isFeedLoading: false });
    }
  };

  onVideoChange = (item) => {
    // Could be a video change within the current unit or a unit change
    let video = null;
    if (typeof item === 'number') {
      this.setState({ selectedVideoIndex: item });
      video = this.state.selectedUnit.videos[item];
    } else {
      this.setState(
        { selectedUnit: item, selectedVideoIndex: 0 },
        this.fetchFeed
      );
      video = item.videos[0];
    }
    const embedData = (video && video.embedData) || {};
    const message = {
      message: 'initialize',
      id: embedData.eid,
      network: embedData.network,
    };
    this.webview.postMessage(JSON.stringify(message));
  };

  getLanguageTitle = (video) => {
    const { dubLang, subLang } = video;
    if (dubLang !== 'ja') {
      return `${LANGUAGE_LOOKUP[dubLang]} Dub`;
    }
    return `${LANGUAGE_LOOKUP[subLang]} Sub`;
  };

  navigateToCreatePost = () => {
    NavigationActions.showCreatePostModal({
      onPostCreated: this.fetchFeed,
      spoiler: true,
      spoiledUnit: this.state.selectedUnit,
      media: this.props.media,
      disableMedia: true,
    });
  };

  navigateToPost = (props) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: Screens.FEED_POST_DETAILS,
        passProps: props,
      },
    });
  };

  navigateToMedia = () => {
    const { media, componentId } = this.props;
    if (!media || !componentId) return;

    Navigation.push(componentId, {
      component: {
        name: Screens.MEDIA_PAGE,
        passProps: {
          mediaId: media.id,
          mediaType: media.type,
        },
      },
    });
  };

  renderLoading = () => <SceneLoader />;

  renderError = () => <ErrorPage showHeader={false} />;

  renderPost = ({ item }) => (
    <Post
      post={item}
      onPostPress={this.navigateToPost}
      currentUser={this.props.currentUser}
      componentId={this.props.componentId}
    />
  );

  renderMedia = () => {
    const { media } = this.props;
    if (!media) return null;

    const image = media && media.posterImage && media.posterImage.small;

    return (
      <View style={styles.mediaContainer}>
        <TouchableOpacity
          style={styles.mediaInnerContainer}
          onPress={this.navigateToMedia}
        >
          {!isNil(image) && (
            <ProgressiveImage
              source={{ uri: image }}
              style={styles.mediaPoster}
            />
          )}
          <View style={styles.mediaInfo}>
            <StyledText color="dark" size="small" numberOfLines={1} bold>
              {media.canonicalTitle || '-'}
            </StyledText>
            <StyledText
              color="dark"
              size="xxsmall"
              numberOfLines={1}
              bold
              textStyle={{ paddingVertical: 4 }}
            >
              {startCase(media.type)}
            </StyledText>
            <StyledText color="dark" size="xsmall" numberOfLines={5}>
              {media.synopsis || '-'}
            </StyledText>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderEmptyFeed = () => (
    <ImageStatus
      title="START THE DISCUSSION"
      text="Be the first to share your thoughts"
      image={emptyComment}
      style={{ backgroundColor: colors.listBackPurple }}
    />
  );

  getItemLayout = (data, index) => {
    const item = data[index];
    const width = item
      ? ITEM_WIDTH + item.number.toString().length * 10 + 10
      : ITEM_WIDTH + 20;
    return { length: width, offset: width * index, index };
  };

  renderUnit = ({ item }) => {
    const { selectedUnit, selectedVideoIndex } = this.state;
    const selectedVideo = selectedUnit.videos[selectedVideoIndex];
    const hasChildVideo = item.videos.filter(
      (video) => video.id === selectedVideo.id
    );
    const width = ITEM_WIDTH + item.number.toString().length * 10;
    return (
      <TouchableOpacity
        style={[
          styles.unitButton,
          hasChildVideo.length === 1 && styles.unitButton__active,
          { minWidth: width, maxWidth: width },
        ]}
        onPress={() => {
          this.onVideoChange(item);
        }}
      >
        <StyledText bold color="dark" size="small">
          {item.type === 'episodes' ? 'EP ' : 'CH '}
          {item.number}
        </StyledText>
      </TouchableOpacity>
    );
  };

  render() {
    const { isFeedLoading, selectedUnit, selectedVideoIndex, discussions } =
      this.state;
    const { media, componentId, shouldShowMediaCard } = this.props;

    const hasVideo = selectedUnit.videos && selectedUnit.videos.length >= 1;
    const selectedVideo = hasVideo && selectedUnit.videos[selectedVideoIndex];

    const unitPrefix = selectedUnit.type === 'episodes' ? 'EP' : 'CH';
    const lowerUnitPrefix =
      selectedUnit.type === 'episodes' ? 'episode' : 'chapter';
    const releaseText =
      selectedUnit.type === 'episodes' ? 'Aired' : 'Published';
    let unitDate =
      selectedUnit.type === 'episodes'
        ? selectedUnit.airdate
        : selectedUnit.published;
    unitDate = unitDate && moment(unitDate).format('MMMM Do, YYYY');

    // Multiple video language options
    const languageOptions =
      hasVideo &&
      selectedUnit.videos.map((video, index) => ({
        text: this.getLanguageTitle(video),
        value: index,
      }));
    if (languageOptions) {
      languageOptions.push('Nevermind');
    }

    // Select only units that have videos
    const episodes = (media && media.episodes) || [];
    const units =
      hasVideo &&
      episodes
        .filter((item) => item.videos.length >= 1)
        .sort((a, b) => a.number - b.number);
    const unitsIndex =
      hasVideo &&
      Math.max(
        0,
        units.findIndex(
          (item) =>
            item.videos.filter((video) => video.id === selectedVideo.id)
              .length === 1
        )
      );

    // Injected javascript
    const selectedVideoData = (selectedVideo && selectedVideo.embedData) || {};
    const injectedJavaScript = `window.initializeHulu('${selectedVideoData.eid}', '${selectedVideoData.network}');`;

    return (
      <View style={styles.container}>
        <CustomHeader
          leftButtonAction={() => Navigation.pop(componentId)}
          leftButtonTitle="Back"
          backgroundColor={colors.listBackPurple}
        />
        <ScrollView style={styles.container}>
          {/* Video */}
          {hasVideo && (
            <View style={styles.videoContainer}>
              <WebComponent
                ref={(ref) => {
                  this.webview = ref;
                }}
                style={styles.webContainer}
                source={{ uri: 'https://kitsu.io/hulu-embed-frame.html' }}
                renderLoading={this.renderLoading}
                renderError={this.renderError}
                injectedJavaScript={injectedJavaScript}
              />
              {/* Type selector */}
              <View style={styles.languageContainer}>
                <SelectMenu
                  options={languageOptions}
                  onOptionSelected={this.onVideoChange}
                >
                  <View style={styles.languageButton}>
                    <StyledText color="dark" size="small">
                      {this.getLanguageTitle(selectedVideo)}
                    </StyledText>
                  </View>
                </SelectMenu>
              </View>
              {/* Unit selector */}
              <View style={styles.unitContainer}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => `${item.id}`}
                  data={units}
                  getItemLayout={this.getItemLayout}
                  initialScrollIndex={unitsIndex}
                  renderItem={this.renderUnit}
                />
              </View>
            </View>
          )}

          {/* Unit information */}
          <View
            style={[
              styles.metaContainer,
              shouldShowMediaCard && styles.metaContainer__mediaVisible,
            ]}
          >
            <View
              style={{
                marginBottom:
                  selectedUnit && isEmpty(selectedUnit.synopsis) ? 0 : 10,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <StyledText color="dark" bold>
                  {unitPrefix} {selectedUnit.number}{' '}
                </StyledText>
                <StyledText color="dark" textStyle={{ flex: 1 }}>
                  {selectedUnit.canonicalTitle}
                </StyledText>
              </View>
              {unitDate && (
                <StyledText color="grey" size="xsmall">
                  First {releaseText}: {unitDate}
                </StyledText>
              )}
            </View>
            {selectedUnit && !isEmpty(selectedUnit.synopsis) && (
              <ViewMoreStyledText
                size="small"
                color="dark"
                ellipsizeMode="tail"
                numberOfLines={4}
              >
                {selectedUnit.synopsis}
              </ViewMoreStyledText>
            )}
          </View>

          {/* Media */}
          {shouldShowMediaCard && this.renderMedia()}

          {/* Feed */}
          <View>
            <View style={{ marginHorizontal: 10, marginVertical: 15 }}>
              <CreatePostRow
                title={`What did you think of this ${lowerUnitPrefix}?`}
                onPress={this.navigateToCreatePost}
                style={{ borderRadius: 6 }}
              />
            </View>
            <View style={{ paddingVertical: scenePadding }}>
              <SectionHeader title="Discussion" />
              {isFeedLoading ? (
                this.renderLoading()
              ) : (
                <KeyboardAwareFlatList
                  data={discussions}
                  keyExtractor={(item) => `${item.id}`}
                  renderItem={this.renderPost}
                  ListEmptyComponent={this.renderEmptyFeed}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export default connect(mapStateToProps)(Unit);
