import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Kitsu } from 'kitsu/config/api';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { preprocessFeed } from 'kitsu/utils/preprocessFeed';
import { CreatePostRow } from 'kitsu/screens/Feed/components/CreatePostRow';
import { View, FlatList } from 'react-native';

class FeedComponent extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    profile: PropTypes.object,
  }

  static defaultProps = {
    profile: null,
  }

  state = {
    error: null,
    loading: false,
    feed: [],
  }

  componentDidMount() {
    this.fetchFeed();
  }

  navigateToPost = (props) => {
    this.props.navigation.navigate('PostDetails', props);
  }

  fetchFeed = async () => {
    const { userId } = this.props;

    this.setState({ loading: true });

    try {
      const result = await Kitsu.one('userFeed', userId).get({
        include: 'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry,subject.anime,subject.manga',
        filter: {
          kind: 'posts',
        },
        // TODO: Maybe later find a way for infinite scrolling
        page: {
          limit: 40,
        },
      });

      // Need to change this here if we want to also display media updates, follows, etc
      const feed = preprocessFeed(result).filter(i => i.type === 'posts');

      this.setState({
        feed,
        loading: false,
      });
    } catch (error) {
      console.log(error);
      this.setState({ error, loading: false });
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

  renderItem = ({ item }) => (
    <Post
      post={item}
      onPostPress={this.navigateToPost}
      currentUser={this.props.currentUser}
      navigation={this.props.navigation}
    />
  );

  render() {
    const { profile } = this.props;
    const { loading, feed } = this.state;

    // TODO: Show error state here
    return (
      <SceneContainer>
        <View style={{ paddingTop: 10 }}>
          <CreatePostRow onPress={this.navigateToCreatePost} targetUser={profile} />
        </View>
        {/* Feed */}
        { loading ?
          <SceneLoader />
          :
          <FlatList
            listKey="feed"
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

export default connect(mapStateToProps)(FeedComponent);
