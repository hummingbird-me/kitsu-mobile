import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Kitsu } from 'kitsu/config/api';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { preprocessFeed } from 'kitsu/utils/preprocessFeed';
import { CreatePostRow } from 'kitsu/screens/Feed/components/CreatePostRow';
import { View, FlatList, Platform } from 'react-native';
import { Screens, NavigationActions } from 'kitsu/navigation';
import { Navigation } from 'react-native-navigation';
import URL from 'url-parse';
import { listBackPurple } from 'kitsu/constants/colors';
import { Button } from 'kitsu/components/Button';
import { isEmpty, uniqBy } from 'lodash';
import { isAoProOrKitsuPro } from 'kitsu/utils/user';
import { ADMOB_AD_UNITS } from 'kitsu/constants/app';

interface FeedComponentProps {
  componentId: any;
  userId: string;
  currentUser: object;
  profile?: object;
}

class FeedComponent extends PureComponent<FeedComponentProps> {
  static defaultProps = {
    profile: null,
  }

  state = {
    error: null,
    feed: [],
    loadingFeed: true,
    loadingNextFeed: false,
  }

  componentDidMount() {
    this.fetchFeed({ reset: true });
  }

  navigateToPost = (props) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: Screens.FEED_POST_DETAILS,
        passProps: props,
      },
    });
  }

  canFetchNextFeed = true;
  feedCursor = undefined;
  fetchFeed = async ({ reset = false } = {}) => {
    const { userId } = this.props;

    if (reset) {
      this.canFetchNextFeed = true;
      this.feedCursor = undefined;
      this.setState({ loadingFeed: true });
    } else if (this.canFetchNextFeed) {
      this.setState({ loadingNextFeed: true });
    }

    let data = [];
    try {
      const result = await Kitsu.one('userFeed', userId).get({
        include: 'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry,subject.anime,subject.manga,subject.uploads,target.uploads',
        filter: {
          kind: 'posts',
        },
        page: {
          cursor: this.feedCursor,
          limit: 10,
        },
      });

      // I need to read the cursor value out of the 'next' link in the result.
      this.canFetchNextFeed = !isEmpty(result && result.links && result.links.next);
      const url = new URL(result.links.next, true);
      this.feedCursor = url.query['page[cursor]'];

      // Need to change this here if we want to also display media updates, follows, etc
      const feed = preprocessFeed(result).filter(i => i.type === 'posts');
      data = reset ? [...feed] : [...this.state.feed, ...feed];
      data = uniqBy(data, 'id');
    } catch (error) {
      console.log(error);
      data = [];
      this.setState({ error });
    } finally {
      this.setState({
        feed: data,
        loadingFeed: false,
        loadingNextFeed: false,
      });
    }
  }

  navigateToCreatePost = () => {
    if (this.props.currentUser) {
      NavigationActions.showCreatePostModal({
        onPostCreated: this.fetchFeed,
        targetUser: this.props.profile,
      });
    }
  };

  renderItem = ({ item, index }) => (
    <React.Fragment>
      <Post
        post={item}
        onPostPress={this.navigateToPost}
        currentUser={this.props.currentUser}
        componentId={this.props.componentId}
      />
      {/* Render a AdMobBanner every 3 posts */}
      {/*!isAoProOrKitsuPro(this.props.currentUser) &&
        ((index + 1) % 3 === 0) && (
        <React.Fragment>
          <View style={{ marginTop: 10 }} />
          <AdMobBanner
            adUnitID={ADMOB_AD_UNITS[Platform.OS]}
            adSize="smartBannerPortrait"
            testDevices={[AdMobBanner.simulatorId]}
            onAdFailedToLoad={error => console.log(error)}
          />
        </React.Fragment>
        )*/}
    </React.Fragment>
  );

  render() {
    const { profile } = this.props;
    const { loadingFeed, loadingNextFeed, feed } = this.state;

    // TODO: Show error state here
    return (
      <SceneContainer>
        <View style={{ paddingTop: 10 }}>
          <CreatePostRow onPress={this.navigateToCreatePost} targetUser={profile} />
        </View>
        {/* Feed */}
        { loadingFeed ?
          <SceneLoader />
          :
          <React.Fragment>
            <FlatList
              listKey="feed"
              data={feed || []}
              keyExtractor={item => `${item.id}`}
              renderItem={this.renderItem}
              />
            {/* @Temporary - Load more button */}
            { this.canFetchNextFeed && (
              <Button
                style={{ backgroundColor: listBackPurple }}
                title="Load More"
                onPress={() => { this.fetchFeed(); } }
                loading={loadingNextFeed}
              />
            )}
          </React.Fragment>
        }
      </SceneContainer>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export default connect(mapStateToProps)(FeedComponent);
