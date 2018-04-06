import React, { PureComponent } from 'react';
import { ScrollView, View, WebView, Platform, Text, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import WKWebView from 'react-native-wkwebview-reborn';
import HuluHTML from 'kitsu/assets/html/hulu-iframe';
import emptyComment from 'kitsu/assets/img/quick_update/comment_empty.png';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { ErrorPage } from 'kitsu/screens/Profiles/components/ErrorPage';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { StyledText, ViewMoreStyledText } from 'kitsu/components/StyledText';
import { CreatePostRow } from 'kitsu/screens/Feed/components/CreatePostRow';
import { preprocessFeed } from 'kitsu/utils/preprocessFeed';
import { Kitsu } from 'kitsu/config/api';
import * as colors from 'kitsu/constants/colors';
import moment from 'moment';
import URL from 'url-parse';
import { scenePadding } from 'kitsu/screens/Feed/constants';
import { SectionHeader } from 'kitsu/screens/Profiles/components/SectionHeader';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { ImageStatus } from 'kitsu/components/ImageStatus';

class Unit extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    header: () => {
      const { unit } = navigation.state.params;
      const type = unit.type === 'episodes' ? 'Episodes' : 'Chapters';
      return (
        <CustomHeader
          leftButtonAction={() => navigation.goBack(null)}
          leftButtonTitle={`Back to ${type}`}
          backgroundColor={colors.listBackPurple}
        />
      );
    },
  });

  state = {
    hasVideo: false,
    isFeedLoading: true,
    discussions: [],
  };

  componentDidMount() {
    const { navigation: { state: { params } } } = this.props;
    const hasVideos = (params.unit.videos || []).length >= 1;
    if (hasVideos) {
      this.setState({ hasVideo: true });
    }
    this.fetchFeed();
  }

  fetchFeed = async () => {
    const { unit } = this.props.navigation.state.params;
    this.setState({ isFeedLoading: true });
    try {
      const posts = await Kitsu.find('episodeFeed', unit.id, {
        include: 'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry,subject.anime,subject.manga',
        filter: { kind: 'posts' },
        page: { limit: 10, },
      });
      const discussions = preprocessFeed(posts);
      this.setState({ discussions, isFeedLoading: false });
    } catch (error) {
      console.log('Failed to fetch feed:', error);
      this.setState({ discussions: [], isFeedLoading: false });
    }
  };

  onMessage = (event) => {
    const { nativeEvent: { data } } = event;
    switch (data) {
      case 'loaded':
        this.webview.postMessage('initialize');
        break;
      default:
        console.debug('Unhandled message sent from WebView');
        break;
    }
  };

  navigateToCreatePost = () => {
    this.props.navigation.navigate('CreatePost', {
      onNewPostCreated: this.fetchFeed,
      spoiler: true,
      spoiledUnit: this.props.navigation.state.params.unit,
      media: this.props.navigation.state.params.media,
      isMediaDisabled: true,
    });
  };

  renderLoading = () => (
    <SceneLoader />
  );

  renderError = () => (
    <ErrorPage showHeader={false} />
  );

  renderPost = ({ item }) => (
    <Post
      post={item}
      onPostPress={this.navigateToPost}
      currentUser={this.props.currentUser}
      navigation={this.props.navigation}
    />
  );

  renderEmptyFeed = () => (
    <ImageStatus
      title="START THE DISCUSSION"
      text="Be the first to share your thoughts"
      image={emptyComment}
      style={{ backgroundColor: colors.listBackPurple }}
    />
  );

  render() {
    const { hasVideo, isFeedLoading, discussions } = this.state;
    const { unit } = this.props.navigation.state.params;

    const unitPrefix = unit.type === 'episodes' ? 'EP' : 'CH';
    const lowerUnitPrefix = unit.type === 'episodes' ? 'episode' : 'chapter';
    const releaseText = unit.type === 'episodes' ? 'Aired' : 'Published';
    let unitDate = unit.type === 'episodes' ? unit.airdate : unit.published;
    unitDate = unitDate && moment(unitDate).format('MMMM Do, YYYY');

    const WebComponent = Platform.OS === 'ios' ? WKWebView : WebView;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.listBackPurple }}>
        {hasVideo && (
          <View style={{ flex: 1, backgroundColor: 'black' }}>
            <WebComponent
              ref={ref => { this.webview = ref; }}
              source={{ html: HuluHTML }}
              onMessage={this.onMessage}
              renderLoading={this.renderLoading}
              renderError={this.renderError}
            />
          </View>
        )}

        {/* Unit information */}
        <View style={{ backgroundColor: colors.white, padding: 20 }}>
          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <StyledText color="dark" bold>{unitPrefix} {unit.number} </StyledText>
              <StyledText color="dark">{unit.canonicalTitle}</StyledText>
            </View>
            {unitDate && (
              <StyledText color="grey" size="xsmall">First {releaseText}: {unitDate}</StyledText>
            )}
          </View>
          <ViewMoreStyledText size="small" color="dark" ellipsizeMode="tail" numberOfLines={4}>{unit.synopsis}</ViewMoreStyledText>
        </View>

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
                keyExtractor={item => item.id}
                renderItem={this.renderPost}
                ListEmptyComponent={this.renderEmptyFeed}
              />
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
};

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export default connect(mapStateToProps)(Unit);
