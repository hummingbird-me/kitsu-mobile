import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TabRouter } from 'react-navigation';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import { Kitsu } from 'kitsu/config/api';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { Summary } from 'kitsu/screens/Profiles/MediaPages/pages/Summary';
import { TabBar, TabBarLink } from 'kitsu/screens/Profiles/components/TabBar';
import { SceneHeader } from 'kitsu/screens/Profiles/components/SceneHeader';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { MaskedImage } from 'kitsu/screens/Profiles/components/MaskedImage';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import { coverImageHeight } from 'kitsu/screens/Profiles/constants';

const MAIN_BUTTON_OPTIONS = ['Watch', 'Want to Watch', 'Completed', 'On Hold', 'Dropped', 'Cancel', 'Nevermind'];
const MORE_BUTTON_OPTIONS = ['Add to Favorites', 'Follow this Anime\'s Feed', 'Nevermind'];

// TODO: Note we're using this to work around a bug in React Navigation:
// https://github.com/react-community/react-navigation/issues/143
// export const requests = {};

const TAB_ITEMS = [
  { key: 'summary', label: 'Summary', screen: 'Summary' },
  { key: 'episodes', label: 'Episodes', screen: 'Episodes' },
  { key: 'characters', label: 'Characters', screen: 'Characters' },
  { key: 'reactions', label: 'Reactions', screen: 'Reactions' },
  { key: 'franchise', label: 'Franchise', screen: 'Franchise' },
];

/* eslint-disable global-require */

const TabRoutes = TabRouter({
  Summary: { screen: Summary },
  Episodes: { getScreen: () => require('./pages/Episodes').Episodes },
  Characters: { getScreen: () => require('./pages/Characters').Characters },
  Reactions: { getScreen: () => require('./pages/Reactions').Reactions },
  Franchise: { getScreen: () => require('./pages/Franchise').Franchise },
}, {
  initialRouteName: 'Summary',
});

/* eslint-enable global-require */

class MediaPages extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = {
    header: null,
  }

  state = {
    active: 'Summary',
    loading: false,
    media: null,
    castings: null,
    mediaReactions: null,
  }

  componentDidMount = () => {
    // const mediaType = requests.requestedMediaType ||
    //   (this.props.navigation.state.params || {}).mediaType ||
    //   this.props.mediaType;
    //
    // const mediaId = requests.requestedMediaId ||
    //   (this.props.navigation.state.params || {}).mediaId ||
    //   this.props.mediaId;

    const { mediaId, mediaType } = this.props.navigation.state.params;
    this.fetchMedia(mediaType, mediaId);

    // if (requests.requestedMediaType) {
    //   delete requests.requestedMediaType;
    // }
    //
    // if (requests.requestedMediaId) {
    //   delete requests.requestedMediaId;
    // }
  }

  onMainButtonOptionsSelected = () => {}
  onMoreButtonOptionsSelected = () => {}

  setActiveTab = (tab) => {
    this.setState({ active: tab });
  }

  goBack = () => this.props.navigation.goBack();

  fetchMedia = async (type, id) => {
    this.setState({ loading: true });
    try {
      const media = await Kitsu.one(type, id).get({
        include: `categories,mediaRelationships.destination,${type === 'anime' ? 'episodes' : 'chapters'}`,
      });

      // Now that we've got the media, everything else can go async together.
      const [
        castings,
        mediaReactions,
      ] = await Promise.all([
        Kitsu.findAll('castings', {
          filter: {
            mediaId: id,
            isCharacter: true,
          },
          sort: '-featured',
          include: 'character',
        }),
        Kitsu.findAll('mediaReactions', {
          filter: {
            [`${type}Id`]: id,
          },
          include: 'user',
          sort: '-upVotesCount',
        }),
      ]);

      this.setState({
        loading: false,
        castings,
        media,
        mediaReactions,
      });
    } catch (error) {
      this.setState({
        loading: false,
        error,
      });
    }
  }

  renderTabNav = () => (
    <TabBar>
      {TAB_ITEMS.map(tabItem => (
        <TabBarLink
          key={tabItem.key}
          label={tabItem.label}
          isActive={this.state.active === tabItem.screen}
          onPress={() => this.setActiveTab(tabItem.screen)}
        />
      ))}
    </TabBar>
  );

  render() {
    const {
      castings,
      error,
      loading,
      media,
      mediaReactions,
    } = this.state;
    const TabScene = TabRoutes.getComponentForRouteName(this.state.active);

    if (loading) {
      return (
        <SceneContainer>
          <SceneLoader />
        </SceneContainer>
      );
    }

    if (error || !media) {
      return null;
    }

    return (
      <SceneContainer>
        <ParallaxScroll
          headerHeight={60}
          isHeaderFixed
          parallaxHeight={coverImageHeight}
          renderParallaxBackground={() => (
            <MaskedImage
              maskedTop
              maskedBottom
              source={{ uri: (media.coverImage && media.coverImage.original) || defaultCover }}
            />
          )}
          renderHeader={() => (
            <CustomHeader
              leftButtonAction={this.goBack}
              leftButtonTitle={this.props.navigation.state.params.profileName}
            />
          )}
          headerFixedBackgroundColor={listBackPurple}
        >
          <SceneHeader
            variant="media"
            media={media}
            type={media.type}
            title={media.canonicalTitle}
            description={media.synopsis}
            coverImage={media.coverImage && media.coverImage.original}
            posterImage={media.posterImage && media.posterImage.large}
            popularityRank={media.popularityRank}
            ratingRank={media.ratingRank}
            categories={media.categories}
            mainButtonTitle="Add to library"
            mainButtonOptions={MAIN_BUTTON_OPTIONS}
            moreButtonOptions={MORE_BUTTON_OPTIONS}
            onMainButtonOptionsSelected={this.onMainButtonOptionsSelected}
            onMoreButtonOptionsSelected={this.onMoreButtonOptionsSelected}
            onHeaderLeftButtonPress={this.goBack}
            headerLeftButtonTitle={this.props.navigation.state.params.profileName}
          />
          {this.renderTabNav()}
          <TabScene
            setActiveTab={tab => this.setActiveTab(tab)}
            media={media}
            mediaId={media.id}
            mediaReactions={mediaReactions}
            castings={castings}
            navigation={navigation}
          />
        </ParallaxScroll>
      </SceneContainer>
    );
  }
}

export default MediaPages;
