import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Kitsu } from 'kitsu/config/api';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { ScrollableSection } from 'kitsu/screens/Profiles/components/ScrollableSection';
import { ScrollItem } from 'kitsu/screens/Profiles/components/ScrollItem';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';
import { preprocessFeed } from 'kitsu/utils/preprocessFeed';

class SummaryComponent extends PureComponent {
  static propTypes = {
    castings: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
    media: PropTypes.object.isRequired,
    mediaReactions: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
    setActiveTab: PropTypes.func.isRequired,
  }

  state = {
    loading: true,
  }

  componentDidMount = () => {
    this.fetchFeed();
  }

  navigateTo = (scene) => {
    this.props.setActiveTab(scene);
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

      const feed = preprocessFeed(result);

      this.setState({
        feed,
        loading: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  navigateToPost = (props) => {
    this.props.navigation.navigate('PostDetails', props);
  }

  navigateToUserProfile = (userId) => {
    this.props.navigation.navigate('ProfilePages', { userId });
  }

  render() {
    const { media, castings, mediaReactions } = this.props;
    const { loading, feed } = this.state;
    const series = media.type === 'anime' ? media.episodes || [] : media.chapters || [];
    const seriesCount = series.length;

    return (
      <SceneContainer>
        {/* Episodes */}
        <ScrollableSection
          title={`Episodes・${seriesCount}`}
          onViewAllPress={() => this.navigateTo('Episodes')}
          data={this.formatData(series)}
          renderItem={({ item }) => (
            <ScrollItem>
              <ImageCard
                subtitle={`Ep. ${item.number} of ${media.episodeCount}`}
                title={item.canonicalTitle}
                variant="landscapeLarge"
                source={{
                  uri:
                    (item.thumbnail && item.thumbnail.original) ||
                    (media.posterImage && media.posterImage.large),
                }}
              />
            </ScrollItem>
          )}
        />

        {/* Related Media */}
        <ScrollableSection
          contentDark
          title="More from this series"
          data={this.formatData(media.mediaRelationships)}
          renderItem={({ item }) => (
            <ScrollItem>
              <ImageCard
                variant="portraitLarge"
                title={item.destination.canonicalTitle}
                source={{
                  uri: item.destination.posterImage && item.destination.posterImage.original,
                }}
              />
            </ScrollItem>
          )}
        />

        {/* Reactions */}
        <ScrollableSection
          title="Reactions"
          onViewAllPress={() => this.navigateTo('Reactions')}
          data={mediaReactions}
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

        {/* Characters */}
        <ScrollableSection
          contentDark
          title="Characters"
          onViewAllPress={() => this.navigateTo('Characters')}
          data={castings}
          renderItem={({ item }) => (
            <ScrollItem>
              <ImageCard
                variant="portrait"
                title={item.character.name}
                source={{
                  uri: item.character.image && item.character.image.original,
                }}
              />
            </ScrollItem>
          )}
        />

        {/* Feed */}
        { !loading &&
          feed.map(item => (
            <Post
              post={item}
              onPostPress={this.navigateToPost}
              currentUser={this.props.currentUser}
              navigateToUserProfile={userId => this.navigateToUserProfile(userId)}
              navigation={this.props.navigation}
            />
          ))
        }

      </SceneContainer>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export const Summary = connect(mapStateToProps)(SummaryComponent);
