import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { isEmpty, capitalize } from 'lodash';

import { Kitsu } from 'kitsu/config/api';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { ScrollableSection } from 'kitsu/screens/Profiles/components/ScrollableSection';
import { ScrollItem } from 'kitsu/screens/Profiles/components/ScrollItem';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';
import { StyledText } from 'kitsu/components/StyledText';
import { Rating } from 'kitsu/components/Rating';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { CreatePostRow } from 'kitsu/screens/Feed/components/CreatePostRow';
import { SectionHeader } from 'kitsu/screens/Profiles/components/SectionHeader';
import { preprocessFeed } from 'kitsu/utils/preprocessFeed';
import { scenePadding } from 'kitsu/screens/Profiles/constants';

export default class Summary extends PureComponent {
  static propTypes = {
    setActiveTab: PropTypes.func,
    userId: PropTypes.number.isRequired,
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
  }

  static defaultProps = {
    setActiveTab: null,
  }

  state = {
    loading: true,
    libraryActivity: null,
    error: null,
    userReactions: null,
    feed: [],
    isReactionsLoading: false,
    isFeedLoading: false,
  }

  componentDidMount() {
    this.loadLibraryActivity();
    this.loadReactions();
    this.loadFeed();
  }

  loadLibraryActivity = async () => {
    const { userId } = this.props;

    try {
      const libraryActivity = await Kitsu.findAll('libraryEvents', {
        page: { limit: 20 },
        filter: { userId },
        sort: '-createdAt',
        include: 'libraryEntry.media',
      });

      this.setState({
        loading: false,
        libraryActivity,
      });
    } catch (error) {
      console.log('Error while fetching library entries: ', error);

      this.setState({
        loading: false,
        error,
      });
    }
  }

  loadReactions = async () => {
    const { userId } = this.props;
    this.setState({ isReactionsLoading: true });
    try {
      const reactions = await Kitsu.findAll('mediaReactions', {
        filter: { userId },
        include: 'anime,user,manga',
        sort: 'upVotesCount',
        page: { limit: 5 },
      });
      this.setState({ userReactions: reactions, isReactionsLoading: false });
    } catch (error) {
      console.log('Error fetching reactions for user:', error);
      this.setState({ isReactionsLoading: false });
    }
  }

  loadFeed = async () => {
    const { userId } = this.props;
    this.setState({ isFeedLoading: true });
    try {
      const result = await Kitsu.one('userFeed', userId).get({
        include: 'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry,subject.anime,subject.manga',
        filter: {
          kind: 'posts',
        },
        page: { limit: 40, },
      });
      const feed = preprocessFeed(result).filter(i => i.type === 'posts');
      this.setState({
        feed,
        isFeedLoading: false,
      });
    } catch (error) {
      console.log(error);
      this.setState({ error, isFeedLoading: false });
    }
  }

  navigateTo = (scene) => {
    this.props.setActiveTab(scene);
  }

  navigateToMedia = (media) => {
    if (media) {
      this.props.navigation.navigate('MediaPages', {
        mediaId: media.id,
        mediaType: media.type,
      });
    }
  }

  navigateToCreatePost = () => {
    if (this.props.currentUser) {
      this.props.navigation.navigate('CreatePost', {
        onNewPostCreated: this.fetchFeed,
        targetUser: this.props.profile,
      });
    }
  };

  navigateToPost = (props) => {
    this.props.navigation.navigate('PostDetails', props);
  };

  formatData(data, numberOfItems = 12) {
    return data.sort((a, b) => a - b).slice(0, numberOfItems);
  }

  renderLibraryActivity = (item) => {
    const entry = item.libraryEntry;
    if (isEmpty(entry)) return <View />;

    let caption = '';
    const data = item.changedData;
    const rating = (data && data.rating && data.rating[1]) || entry.rating;

    if (data) {
      if (data.status && data.status.length > 1) {
        caption = `${capitalize(data.status[1].replace('_', ' '))}`;
      } else if (data.progress && data.progress.length > 1) {
        caption = `${entry.media.type === 'anime' ? 'Watched Ep.' : 'Read Ch.'} ${data.progress[1]}`;
      } else if (item.kind === 'rated') {
        caption = 'Rated  ';
      }
    }

    return (
      <ScrollItem>
        <TouchableOpacity
          onPress={() => this.navigateToMedia(entry.media)}
        >
          <ImageCard
            noMask
            variant="portraitLarge"
            source={{
              uri: entry.media.posterImage && entry.media.posterImage.original,
            }}
          />
          <View style={{ alignSelf: 'center', marginTop: 3, flexDirection: 'row' }}>
            <StyledText size="xxsmall" color="dark">{caption}</StyledText>
            {item.kind === 'rated' && (
              <Rating
                disabled
                ratingTwenty={rating}
                ratingSystem={this.props.currentUser.ratingSystem}
                size="tiny"
                viewType="single"
                showNotRated={false}
              />
            )}
          </View>
        </TouchableOpacity>
      </ScrollItem>
    );
  }

  renderPost = ({ item }) => (
    <Post
      post={item}
      onPostPress={this.navigateToPost}
      currentUser={this.props.currentUser}
      navigation={this.props.navigation}
    />
  );

  render() {
    const { loading, error, libraryActivity, userReactions } = this.state;

    if (loading) return <SceneLoader />;

    if (error) {
      // Return error state
      return null;
    }

    return (
      <SceneContainer>
        {/* Post */}
        <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
          <CreatePostRow onPress={this.navigateToCreatePost} targetUser={this.props.profile} />
        </View>

        {/* Library Activity */}
        <ScrollableSection
          contentDark
          title="Library Activity"
          onViewAllPress={() => this.navigateTo('Library')}
          data={libraryActivity}
          renderItem={({ item }) => this.renderLibraryActivity(item)}
        />

        {/* Reactions */}
        {/* @TODO: Empty state when userReactions != null && empty */}
        <ScrollableSection
          title="Reactions"
          onViewAllPress={() => this.navigateTo('Reactions')}
          data={userReactions}
          loading={this.state.isReactionsLoading}
          renderItem={({ item }) => {
            const title =
              (item.anime && item.anime.canonicalTitle) ||
              (item.manga && item.manga.canonicalTitle) || '-';
            return (
              <ScrollItem>
                <ReactionBox
                  boxed
                  reactedMedia={title}
                  reaction={item}
                />
              </ScrollItem>
            );
          }}
        />

        {/* Feed */}
        <View style={{ paddingVertical: scenePadding }}>
          <SectionHeader title="Activity" />
          {this.state.isFeedLoading ? (
            <SceneLoader />
          ) : (
            <KeyboardAwareFlatList
              data={this.state.feed || []}
              keyExtractor={item => item.id}
              renderItem={this.renderPost}
              ListEmptyComponent={() => {}}
            />
          )}
        </View>
      </SceneContainer>
    );
  }
}
