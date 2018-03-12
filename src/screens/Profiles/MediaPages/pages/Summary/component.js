import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Kitsu } from 'kitsu/config/api';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { ScrollableSection } from 'kitsu/screens/Profiles/components/ScrollableSection';
import { ScrollItem } from 'kitsu/screens/Profiles/components/ScrollItem';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';
import { MediaDetails } from 'kitsu/screens/Profiles/components/MediaDetails';
import { preprocessFeed } from 'kitsu/utils/preprocessFeed';
import { upperFirst, isNull } from 'lodash';
import { SummaryProgress } from './progress';

class SummaryComponent extends PureComponent {
  static propTypes = {
    castings: PropTypes.array,
    currentUser: PropTypes.object.isRequired,
    media: PropTypes.object.isRequired,
    mediaReactions: PropTypes.array,
    navigation: PropTypes.object.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    loadingAdditional: PropTypes.bool,
    libraryEntry: PropTypes.object,
    onLibraryEditPress: PropTypes.func,
  }

  static defaultProps = {
    castings: null,
    mediaReactions: null,
    loadingAdditional: false,
    libraryEntry: null,
    onLibraryEditPress: null,
  }

  state = {
    loading: true,
  }

  componentDidMount() {
    this.fetchFeed();
  }

  formatData(data, numberOfItems = 12) {
    if (!data) return [];
    return data.sort((a, b) => a.number - b.number).slice(0, numberOfItems);
  }

  fetchFeed = async () => {
    const { type, id } = this.props.media;
    const endpoint = type.charAt(0).toUpperCase() + type.slice(1);

    this.setState({ loading: true });

    try {
      const result = await Kitsu.one('mediaFeed', `${endpoint}-${id}`).get({
        include: 'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry,subject.anime,subject.manga',
        filter: {
          kind: 'posts',
        },
        page: {
          limit: 10,
        },
      });

      const feed = preprocessFeed(result).filter(i => i.type === 'posts');
      this.setState({
        feed,
        loading: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  navigateTo = scene => this.props.setActiveTab(scene);
  navigateToPost = props => this.props.navigation.navigate('PostDetails', props);
  navigateToUserProfile = userId => this.props.navigation.navigate('ProfilePages', { userId });
  navigateToMedia = (mediaType, mediaId) => (
    this.props.navigation.navigate('MediaPages', { mediaId, mediaType, })
  );

  renderItem = ({ item }) => (
    <Post
      post={item}
      onPostPress={this.navigateToPost}
      currentUser={this.props.currentUser}
      navigateToUserProfile={userId => this.navigateToUserProfile(userId)}
      navigation={this.props.navigation}
    />
  );

  render() {
    const { media, castings, mediaReactions, loadingAdditional, libraryEntry, onLibraryEditPress } = this.props;
    const { loading, feed } = this.state;

    return (
      <SceneContainer>

        {/* Progress */}
        <SummaryProgress
          libraryEntry={libraryEntry}
          media={media}
          onPress={() => this.navigateTo('Episodes')}
          onEditPress={onLibraryEditPress}
        />

        {/* Details */}
        <MediaDetails media={media} />

        {/* Reactions */}
        {/* @TODO: Reactions Empty State - Render nothing until we support writing */}
        <ScrollableSection
          title="Reactions"
          onViewAllPress={() => this.navigateTo('Reactions')}
          data={mediaReactions}
          loading={loadingAdditional}
          renderItem={({ item }) => (
            <ScrollItem>
              <ReactionBox
                boxed
                reactedMedia={media.canonicalTitle}
                reaction={item}
              />
            </ScrollItem>
          )}
        />

        {/* Related Media */}
        <ScrollableSection
          contentDark
          title="More from this series"
          onViewAllPress={() => this.navigateTo('Franchise')}
          data={this.formatData(media.mediaRelationships)}
          loading={loadingAdditional}
          renderItem={({ item }) => {
            const destination = item.destination;
            if (!destination) return null;

            const subheading = destination.type === 'anime' ? destination.showType : destination.mangaType;

            return (<ScrollItem spacing={4}>
              <ImageCard
                centerTitle
                boldTitle={false}
                variant="portraitLarge"
                title={destination.canonicalTitle}
                subheading={upperFirst(subheading)}
                source={{
                  uri: destination.posterImage && destination.posterImage.original,
                }}
                onPress={() => this.navigateToMedia(destination.type, destination.id)}
              />
            </ScrollItem>);
          }}
        />

        {/* Characters */}
        {/* Disabled for now until we fix up our character db */}
        {/* <ScrollableSection
          contentDark
          title="Characters"
          onViewAllPress={() => this.navigateTo('Characters')}
          data={castings}
          loading={isNull(castings)}
          renderItem={({ item }) => (
            <ScrollItem spacing={4}>
              <ImageCard
                centerTitle
                boldTitle={false}
                variant="portrait"
                title={item.character.name}
                source={{
                  uri: item.character.image && item.character.image.original,
                }}
              />
            </ScrollItem>
          )}
        /> */}

        {/* Feed */}
        { !loading &&
          <FlatList
            data={feed || []}
            keyExtractor={item => item.id}
            renderItem={this.renderItem}
          />
        }

      </SceneContainer>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export const component = connect(mapStateToProps)(SummaryComponent);
