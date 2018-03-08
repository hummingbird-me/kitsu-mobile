import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { Button, Container, Icon } from 'native-base';
import IconAwe from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import uniqBy from 'lodash/uniqBy';
import capitalize from 'lodash/capitalize';
import CustomHeader from 'kitsu/components/CustomHeader';
import DoubleProgress from 'kitsu/components/DoubleProgress';
import CardStatus from 'kitsu/components/Card/CardStatus';
import CardFull from 'kitsu/components/Card/CardFull';
import CardActivity from 'kitsu/components/Card/CardActivity';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import getTitleField from 'kitsu/utils/getTitleField';
import { fetchMedia, fetchMediaReactions, fetchMediaCastings } from 'kitsu/store/media/actions';
import { getMediaFeed } from 'kitsu/store/feed/actions';
import * as colors from 'kitsu/constants/colors';
// import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { defaultAvatar, defaultCover } from 'kitsu/constants/app';
import { getImgixCoverImage } from 'kitsu/utils/coverImage';

const { width } = Dimensions.get('window');

class MediaScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
    headerStyle: {
      position: 'absolute',
      backgroundColor: 'transparent',
      zIndex: 100,
      top: 0,
      left: 0,
      right: 0,
    },
    headerRight: (
      <Button
        style={{
          height: 20,
          width: 83,
          backgroundColor: '#16A085',
          justifyContent: 'center',
          marginRight: 10,
        }}
        small
        success
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: 'white', fontSize: 10 }}>Follow</Text>
      </Button>
    ),
  });

  state = {
    expanded: false,
  }

  animatedValue = new Animated.Value(0);

  componentDidMount() {
    const { state } = this.props.navigation;
    const { mediaId, type } = state.params;
    this.props.fetchMediaReactions(mediaId, type);
    this.props.fetchMediaCastings(mediaId);
    this.props.getMediaFeed(mediaId, type);
    this.props.fetchMedia(mediaId, type);
  }
  expand() {
    if (this.view) {
      if (this.state.expanded) {
        this.view.transition({ height: 200 }, { height: 70.67 }, 100, 'ease-in');
      } else {
        this.view.transition({ height: 70.67 }, { height: 200 }, 100, 'ease-in');
      }
      this.setState({ expanded: !this.state.expanded });
    }
  }

  renderScrollableRow = (items) => {
    const data = items.map((e) => {
      let char = {
        image: defaultAvatar,
      };
      if (e.activities && e.activities[0]) {
        const activity = e.activities[0];
        let caption = '';
        if (activity.verb === 'progressed') {
          caption = `${activity.media.type === 'anime' ? 'Watched ep.' : 'Read ch.'} ${activity.progress}`;
        } else if (activity.verb === 'updated') {
          caption = `${capitalize(activity.status.replace('_', ' '))}`;
        } else if (activity.verb === 'rated') {
          caption = `Rated: ${activity.rating}`;
        }
        char = {
          ...activity,
          image: activity.media.posterImage.original,
          caption,
        };
      }
      return char;
    });
    return (
      <ScrollView horizontal style={{ flexDirection: 'row' }}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{ marginRight: 6, marginTop: 2 }}
            onPress={media =>
              this.props.navigation.navigate('Media', {
                mediaId: item.media.id,
                type: item.media.type,
              })}
          >
            <ProgressiveImage source={{ uri: item.image }} style={{ height: 113.54, width: 81.73, borderRadius: 1 }} />
            <Text
              style={{
                fontSize: 9,
                paddingTop: 3,
                fontFamily: 'OpenSans',
                textAlign: 'center',
              }}
            >
              {item.caption}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  renderImageRow = (data, height = 120, width = 85, type = 'media', hasCaption = false) => {
    return (
      <ScrollView horizontal style={{ flexDirection: 'row', marginBottom: 5 }}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{ margin: 2 }}
            onPress={media =>
              this.props.navigation.navigate('Media', {
                mediaId: item.id,
                type: item.type,
              })}
          >
            <ProgressiveImage source={{ uri: item.image }} style={{ height, width, borderRadius: 1 }} />
            {hasCaption &&
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.5)']}
                style={[{ height, width }, { position: 'absolute', top: 0, borderRadius: 1}]}
              />}
            {hasCaption &&
              <Text
                style={{
                  color: 'white',
                  fontWeight: '500',
                  fontSize: 12,
                  fontFamily: 'OpenSans',
                  position: 'absolute',
                  bottom: 5,
                  backgroundColor: 'transparent',
                  alignSelf: 'center',
                }}
              >
                {item.name}
              </Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  renderEpisodes = () => {
    const { media, navigation } = this.props;
    const { type } = navigation.state.params;
    let series = type === 'anime' ? media.episodes || [] : media.chapters || [];
    series = series.sort((a, b) => a - b).slice(0, 12);
    const imageStyle = { height: 83, width: 148, borderRadius: 3 };
    if (series.length === 0) return;
    return (
      <View style={{ margin: 10}}>
        <Text style={{ color: '#969696', fontSize: 10, marginLeft: 5 }}>
          EPISODES · {media.episodeCount}
        </Text>
        <ScrollView horizontal style={{ flexDirection: 'row' }}>
          {series.map((item, index) => (
            <View style={{ margin: 5 }} key={item.id}>
              <ProgressiveImage
                source={{
                  uri: (item.thumbnail && item.thumbnail.original) ||
                      (media && media.posterImage && media.posterImage.large),
                }}
                style={imageStyle}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'black']}
                style={[imageStyle, { position: 'absolute', top: 0 }]}
              />
              <View
                style={{
                  position: 'absolute',
                  padding: 5,
                  bottom: 0,
                  backgroundColor: 'transparent',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 12,
                    fontFamily: 'OpenSans',
                  }}
                >
                  Episode {index + 1}
                </Text>
                {item.titles &&
                  item.titles.en_jp &&
                  <Text
                    style={{
                      color: 'white',
                      padding: 2,
                      paddingLeft: 0,
                      fontSize: 10,
                      fontFamily: 'Asap',
                    }}
                    numberOfLines={1}
                  >
                    {item.titles.en_jp || ''}
                  </Text>}
              </View>
            </View>
          ))}
          {media && media.episodeCount > 12 &&
            <View style={{ margin: 5 }}>
              <ProgressiveImage
                source={{ uri: media.posterImage && media.posterImage.large }}
                style={imageStyle}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'black']}
                style={[imageStyle, { position: 'absolute', top: 0 }]}
              />
              <View
                style={{
                  position: 'absolute',
                  padding: 5,
                  top: 30,
                  backgroundColor: 'transparent',
                  flex: 1,
                  alignSelf: 'center',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 12,
                    fontFamily: 'OpenSans',
                    alignSelf: 'center',
                  }}
                >
                  View all {media.episodeCount} episodes
                </Text>
              </View>
            </View>}
        </ScrollView>
      </View>
    );
  }

  renderRelatedMedia = () => {
    let more = [0, 1, 2, 3];
    const { mediaRelationships } = this.props.media;
    if (mediaRelationships && mediaRelationships.length === 0) return;
    if (mediaRelationships) {
      more = mediaRelationships.map((item) => {
        if (!item || !item.destination) return null;
        const { destination } = item;
        const title = (destination.titles && (destination.titles.en || destination.titles.en_jp)) || '-';
        return {
          image: destination.posterImage && destination.posterImage.original,
          title,
          id: destination.id,
          type: destination.type,
          key: destination.id,
        };
      }).filter(i => !isNull(i));
    }
    return (
      <CardFull single singleText="View All" heading="More from this series">
        {this.renderImageRow(more.slice(0, 12), 118, 83, 'media')}
      </CardFull>
    );
  }

  renderReactions = () => {
    const { reactions } = this.props;
    console.log(JSON.stringify(reactions));
    return (
      <CardFull
        single
        singleText="Reactions"
        heading="Reactions"
        onPress={() =>
          this.props.navigation.navigate('Reactions', {
            label: 'View all',
            mediaId: this.props.media.id,
          })}
      >
        {
          reactions && reactions.map(item => (
          <Text
            style={{
              fontFamily: 'OpenSans',
              fontSize: 12,
              alignSelf: 'center',
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            {item.reaction}
          </Text>
        )
      )
      }
      </CardFull>
    );
  }

  renderCharacters = () => {
    const { media } = this.props;
    const characters = this.props.castings.map(item => ({
      image: item.character.image ? item.character.image.original : defaultAvatar,
      id: item.character.id,
      name: item.character.name,
      key: item.character.id,
    }));
    return (
      <CardFull
        single
        singleText="View All Characters"
        heading="Characters"
        onPress={() =>
          this.props.navigation.navigate('FavoriteCharacters', {
            label: 'Media Characters',
            mediaId: this.props.media.id,
          })}
      >
        {characters.length === 0 &&
          <Text
            style={{
              fontFamily: 'OpenSans',
              fontSize: 12,
              alignSelf: 'center',
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            Hmm, there doesn't seem to be anything here yet.
          </Text>}
        {this.renderImageRow(
          uniqBy(characters, item => item.id).slice(0, 6),
          115,
          115,
          'character',
          true,
        )}
      </CardFull>
    );
  }

  setTextHeightStyle = () => {
    if (this.state.expanded) {
      return { paddingLeft: 14, paddingRight: 14, paddingTop: 0, flex: 1, paddingBottom: 14, overflow: 'hidden', zIndex: 2 };
    } else {
      return { paddingLeft: 14, paddingRight: 14, paddingTop: 0, height: 70.67, overflow: 'hidden', zIndex: 2 };
    }
  }
  renderHeader = () => {
    const { media, reactions, navigation, currentUser, mediaFeed } = this.props;

    if (!media) return <View />;

    var items = new Array();
    if (media.categories) {
      for (let i = 0; i < Math.min(media.categories.length, 4); i += 1) {
        items.push(media.categories[i]);
      }
    }
    return (
      <View>
        <View
          style={{
            marginTop: 30,
            marginLeft: 14.8,
            marginRight: 13,
            borderRadius: 5,
          }}
        >

          <View style={{ marginTop: -30 }}>
              {reactions[0] && <ProgressiveImage
              source={{
                uri: reactions[0].user.avatar ? reactions[0].user.avatar.small : defaultAvatar,
              }}
              style={{ width: 32.4, height: 32.4, borderRadius: 16.2, maginBottom: 6.2 }}
            />}
          </View>
          <Text
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              fontSize: 10,
              fontWeight: '600',
              fontFamily: 'OpenSans',
              width: width / 1.70,
              marginBottom: 12,
              height: 42,
            }}
            numberOfLines={3}
          >
            {reactions[0] && reactions[0].reaction}
          </Text>
        </View>
        <View style={{ backgroundColor: colors.listBackPurple, borderRadius: 0 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 15,
              paddingTop: 5,
            }}
          >
            <View style={{ width: '66%' }}>
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 14,
                  fontFamily: 'OpenSans',
                  marginTop: 8,
                }}
              >
                {(media.titles && media.titles[getTitleField()]) || media.canonicalTitle}

              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                {media.startDate && new Date(media.startDate).getFullYear()}
              </Text>
              {media.popularityRank &&
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                  <IconAwe
                    name="heart"
                    style={{ fontSize: 11, color: '#e74c3c', marginRight: 5 }}
                  />
                  <Text
                    style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontFamily: 'OpenSans',
                      fontSize: 12,
                      height: 17
                    }}
                  >
                    Rank #{media.popularityRank} (Most Popular)
                  </Text>
                </View>}
              {media.ratingRank &&
                <View style={{ flexDirection: 'row', alignItems: 'center',marginTop: 4 }}>
                  <IconAwe name="star" style={{ fontSize: 11, color: '#f39c12', marginRight: 5 }} />
                  <Text
                    style={{
                      color: 'rgba(255,255,255,0.4)',
                      fontFamily: 'OpenSans',
                      fontSize: 12,
                    }}
                  >
                    Rank #{media.ratingRank} (Highest Rated Anime)
                  </Text>
                </View>}
            </View>
            <View style={{ marginTop: -88.5, flex: 3 }}>
              <ProgressiveImage
                source={{ uri: media.posterImage && media.posterImage.large }}
                style={{ height: 167, width: 118, borderRadius: 3, backgroundColor: colors.imageBackColor }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              padding: 15,
              paddingTop: 0,
              paddingBottom: 5,
              flexWrap: 'wrap',
            }}
          >
            {
              items &&
              items.map(item => (
                <Button
                  style={{
                    height: 20,
                    borderColor: 'rgba(255,255,255,0.5)',
                    backgroundColor: colors.transparent,
                    marginRight: 5,
                    marginBottom: 5,
                    borderRadius: 3,
                    paddingTop: 3,
                    paddingBottom: 3
                  }}
                  bordered
                  key={item.id}
                  light
                >
                  <Text style={{color: 'white', fontSize: 9, fontFamily: 'OpenSans', fontWeight: '600', height: 13, paddingTop: 0, paddingBottom: 0 }}>{item.title}</Text>
                </Button>
              ))
            }
            { media.categories && media.categories.length > 4 &&
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'OpenSans', fontWeight: '600', fontSize: 12, paddingTop: 2 }} > +{media.categories.length - 4} </Text>
            }
          </View>
          <Animatable.View
            style={this.setTextHeightStyle()}
            onPress={() => this.expand()}
            ref={el => (this.view = el)}
          >
            {!this.state.expanded &&
              <LinearGradient
                colors={['rgba(66.3,51,66.3, 0)', 'rgba(66.3,51,66.3, 1)']}
                locations={[0, 1]}
                onPress={() => this.expand()}
                style={{ height: 34, width, position: 'absolute', bottom: 0, zIndex: 1, opacity: 0.95 }}
              />}
            <Text
              onPress={() => this.expand()}
              style={{ fontSize: 12, color: 'white', lineHeight: 17, fontFamily: 'OpenSans' }}
            >
              {media && media.synopsis}
            </Text>
          </Animatable.View>
          <CardFull single heading="Theme / Plot">
            <DoubleProgress left="SLOW" right="FAST" leftProgress={0.3} rightProgress={0} />
            <DoubleProgress left="SIMPLE" right="COMPLEX" leftProgress={0} rightProgress={0.8} />
            <DoubleProgress left="LIGHT" right="DARK" leftProgress={0.3} rightProgress={0} />
            <View
              style={{
                height: '100%',
                position: 'absolute',
                borderLeftWidth: 1,
                top: 10,
                alignSelf: 'center',
                borderColor: '#C0C0C0',
              }}
            />
          </CardFull>
          {this.renderEpisodes()}
          {this.renderRelatedMedia()}
          {this.renderCharacters()}
          {this.renderReactions()}
          {/*
            */}
          <CardStatus
            leftText="Write Post"
            rightText="Share Photo"
            user={currentUser}
            toUser={media}
            style={{ marginLeft: 9, marginRight: 9, marginTop: 11 }}
          />
          <Text
            style={{
              color: '#A8A8A8',
              fontWeight: '500',
              fontSize: 12,
              padding: 10,
              paddingBottom: 5,
              paddingTop: 15,
            }}
          >
            ACTIVITY
          </Text>
        </View>
      </View>
    );
  }

  refresh = (mediaId, type) => {
    this.props.getMediaFeed(mediaId, type);
  }

  loadMore = (mediaId, type) => {
    const { loadingMediaFeed, mediaFeed } = this.props;

    if (loadingMediaFeed) return;
    this.props.getMediaFeed(mediaId, type, mediaFeed[mediaFeed.length - 1].id);
  }

  render() {
    const { media, reactions, navigation, currentUser, mediaFeed, loadingMediaFeed } = this.props;
    return (
      <Container style={styles.container}>
        <ParallaxScrollView
          backgroundColor='#fff0'
          contentBackgroundColor='#fff0'
          parallaxHeaderHeight={210}
          renderBackground={() => (
            <ProgressiveImage
              style={{
                width: Dimensions.get('window').width,
                height: 209,
                backgroundColor: '#fff0',
              }}
              resizeMode="cover"
              source={{ uri: getImgixCoverImage(media.coverImage) || defaultCover }}
            />
          )}
        >
          <View style={{ width: Dimensions.get('window').width, marginTop: -92 }}>
            <FlatList
              data={mediaFeed}
              ListHeaderComponent={() => this.renderHeader()}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <CardActivity {...item} />}

              onEndReached={() => this.loadMore(media.id, media.type)}
              onEndReachedThreshold={0.5}
            />
          </View>
        </ParallaxScrollView>
        <CustomHeader
          navigation={navigation}
          headerImage={{
            uri: getImgixCoverImage(media.coverImage) || '',
          }}
          right={
            <Button
              style={{
                justifyContent: 'center',
                zIndex: 100,
              }}
              transparent
              onPress={() => navigation.goBack()}
            >
              <Text style={{ color: 'white', fontSize: 10, fontFamily: 'OpenSans', fontWeight: '600' }}>ooo</Text>
            </Button>
          }
        />
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { navigation: { state: { params: { mediaId } } } } = ownProps;
  const { loading, media, reactions, castings } = state.media;
  const { currentUser } = state.user;
  const { mediaFeed, loadingMediaFeed } = state.feed;
  const filteredFeed = mediaFeed.filter(
    ({ activities }) => !['comment', 'follow'].includes(activities[0].verb),
  );
  return {
    loading,
    media: media[mediaId] || {},
    reactions: reactions[mediaId] || [],
    castings: castings[mediaId] || [],
    mediaFeed: filteredFeed,
    loadingMediaFeed,
    currentUser,
  };
};

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.listBackPurple,
  },
  customHeader: {
    position: 'absolute',
    top: 0,
    flex: 1,
    alignSelf: 'stretch',
    right: 0,
    left: 0,
  },
};

MediaScreen.propTypes = {
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  media: PropTypes.object.isRequired,
  fetchMediaCastings: PropTypes.func.isRequired,
  fetchMediaReactions: PropTypes.func.isRequired,
  fetchMedia: PropTypes.func.isRequired,
  getMediaFeed: PropTypes.func.isRequired,
  mediaFeed: PropTypes.array.isRequired,
  loadingMediaFeed: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, {
  fetchMedia,
  fetchMediaReactions,
  fetchMediaCastings,
  getMediaFeed,
})(MediaScreen);
