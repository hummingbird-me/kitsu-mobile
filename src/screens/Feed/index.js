import React from 'react';
import PropTypes from 'prop-types';
import { unescape } from 'lodash';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { View, RefreshControl, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import { Kitsu } from 'kitsu/config/api';
import { listBackPurple } from 'kitsu/constants/colors';
import { TabBar, TabBarLink } from 'kitsu/screens/Feed/components/TabBar';
import { CreatePostRow } from 'kitsu/screens/Feed/components/CreatePostRow';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { feedStreams } from './feedStreams';

class Feed extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
  }

  static navigationOptions = {
    header: null,
  }

  state = {
    activeFeed: 'follower',
    refreshing: false,
    data: [],
  }

  componentDidMount = () => {
    this.fetchFeed();
  }

  onRefresh = () => {
    this.fetchFeed({ reset: true });
  }

  setActiveFeed = (feed) => {
    this.setState({ activeFeed: feed });
    this.fetchFeed({ reset: true });
  }

  currentPage = 0

  fetchFeed = async ({ reset = false } = {}) => {
    this.setState({ refreshing: true });

    const PAGE_SIZE = 10;
    if (reset) this.currentPage = 0;

    try {
      const result = await Kitsu.one('followingFeed', this.props.currentUser.id).get({
        include: 'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry,subject.anime,subject.manga',
        filter: { kind: 'posts' },
        page: {
          offset: this.currentPage * PAGE_SIZE,
          limit: PAGE_SIZE,
        },
      });

      this.currentPage += 1;

      // Discard the activity groups and activities for now, flattening to
      // just the subject of the activity.
      let data = reset ? [] : [...this.state.data];

      result.forEach((group) => {
        group.activities.forEach((activity) => {
          data.push(activity.subject);

          // Since we don't support comment posts properly yet,
          // if it's a comment post, just include the actual post as well.
          if (activity.target && activity.target.length > 0) {
            data.push(...activity.target);
          }
        });
      });

      // Pull images out of HTML and replace in content.
      // Regex is the absolutely wrong tool for this job, but we're against a wall on
      // timings and we should probably just structure actual posts better anyway so
      // the app actually knows what kind of post they are and gets the content
      // in the right structure to render them rather than guessing from HTML.
      const imagePattern = /<img[^>]+src="(.+?)"\/?>/ig;
      let lastMatch;
      data = data.map((post) => {
        const images = [];
        // eslint-disable-next-line no-cond-assign
        while ((lastMatch = imagePattern.exec(post.contentFormatted)) !== null) {
          const imageUri = unescape(lastMatch[1]);

          images.push(imageUri);
          // eslint-disable-next-line no-param-reassign
          post.content = post.content.replace(imageUri, '');
        }

        return {
          ...post,
          images,
        };
      });

      this.setState({ data });
    } catch (err) {
      console.log('Error while refreshing following feed: ', err);
    }

    this.setState({ refreshing: false });
  }

  navigateToPost = (props) => {
    this.props.navigation.navigate('PostDetails', props);
  }

  navigateToCreatePost = () => {
    this.props.navigation.navigate('CreatePost', {
      onNewPostCreated: () => this.fetchFeed({ reset: true }),
    });
  }

  navigateToUserProfile = (userId) => {
    this.props.navigation.navigate('ProfilePages', { userId });
  }

  navigateToMedia = ({ mediaId, mediaType }) => {
    this.props.navigation.navigate('MediaPages', { mediaId, mediaType });
  }

  keyExtractor = (item, index) => index

  renderPost = ({ item }) => {
    // This dispatches based on the type of an entity to the correct
    // component. If it's not in here it'll just ignore the feed item.
    switch (item.type) {
      case 'posts':
        return (
          <Post
            post={item}
            onPostPress={this.navigateToPost}
            currentUser={this.props.currentUser}
            navigateToUserProfile={userId => this.navigateToUserProfile(userId)}
            navigateToMedia={(mediaId, mediaType) => this.navigateToMedia(mediaId, mediaType)}
          />
        );
      case 'comments':
        // We explicitly don't render these at the moment.
        return null;
      default:
        console.log(`WARNING: Ignored post type: ${item.type}`);
        return null;
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: listBackPurple }}>
        <StatusBar barStyle="light-content" />
        <TabBar>
          {feedStreams.map(tabItem => (
            <TabBarLink
              key={tabItem.key}
              label={tabItem.label}
              isActive={this.state.activeFeed === tabItem.key}
              onPress={() => this.setActiveFeed(tabItem.key)}
            />
          ))}
        </TabBar>

        <View style={{ flex: 1 }}>
          <KeyboardAwareFlatList
            data={this.state.data}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderPost}
            onEndReached={this.fetchFeed}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={<CreatePostRow onPress={this.navigateToCreatePost} />}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export default connect(mapStateToProps)(Feed);
