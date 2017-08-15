import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { Container, Icon, Spinner } from 'native-base';
import IconAwe from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { Col, Grid } from 'react-native-easy-grid';
import _ from 'lodash';
import moment from 'moment';

import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card/Card';
import CardStatus from '../../components/Card/CardStatus';
import CardFull from '../../components/Card/CardFull';
import CardTabs from '../../components/Card/CardTabs';
import CardActivity from '../../components/Card/CardActivity';
import ProgressiveImage from '../../components/ProgressiveImage';
import * as colors from '../../constants/colors';
import { defaultAvatar } from '../../constants/app';
import ResultsList from '../../screens/Search/Lists/ResultsList';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { defaultCover } from '../../constants/app';
import {
  fetchProfile,
  fetchProfileFavorites,
  fetchLibraryEntires,
} from '../../store/profile/actions';
import { getUserFeed } from '../../store/feed/actions';

const Loader = <Spinner size="small" color="grey" />;
class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-body" android="md-body" style={{ fontSize: 20, color: tintColor }} />
      //<Image source={require('../../assets/img/tabbar_icons/menu.png')} style={{ tintColor: tintColor, width: 20, height: 20.44 }} />
    ),
    header: null,
  });

  constructor(props) {
    super(props);
    const userId = props.navigation.state.params && props.navigation.state.params.userId;
    this.state = {
      page: 0,
      userId,
    };
    this.renderInfoBlock = this.renderInfoBlock.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    const { userId } = this.state;
    this.props.fetchProfile(userId);
    this.props.fetchLibraryEntires(userId, 12);
    this.props.fetchProfileFavorites(userId, 'character');
    this.props.fetchProfileFavorites(userId, 'manga');
    this.props.fetchProfileFavorites(userId, 'anime');
    this.props.getUserFeed(userId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile !== this.props.profile) {
      // this.props.navigation.setParams({ name: nextProps.profile.name });
    }
  }

  renderImageRow(items, height = 120, hasCaption, type) {
    let data = items;
    if (type === 'characters') {
      data = items.map((e) => {
        let char = {
          image: defaultAvatar,
        };
        if (e.image) {
          char = {
            ...e,
            image: e.image.original,
          };
        }
        return char;
      });
    }
    if (type === 'entries') {
      data = items.map((e) => {
        let char = {
          image: defaultAvatar,
        };
        if (e.media) {
          char = {
            ...e,
            image: e.media.posterImage.original,
          };
        }
        return char;
      });
    }
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
        {data.map((item, index) => (
          <View key={index} style={{ flex: 1, paddingRight: index === data.length - 1 ? 0 : 3 }}>
            <ProgressiveImage
              source={{ uri: item.image }}
              containerStyle={{
                height,
                backgroundColor: colors.imageGrey,
              }}
              style={{ height, borderRadius: 1 }}
            />

          </View>
        ))}
      </View>
    );
  }

  renderScrollableLibrary(items) {
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
          caption = `${_.capitalize(activity.status.replace('_', ' '))}`;
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
            onPress={() =>
              this.props.navigation.navigate('Media', {
                mediaId: item.media.id,
                type: item.media.type,
              })}
          >
            <ProgressiveImage source={{ uri: item.image }} style={{ height: 113.54, width: 81.73, borderRadius: 1 }} />
            <Text
              style={{
                fontSize: 9,
                paddingTop: 2,
                fontFamily: 'OpenSans',
                textAlign: 'center',
                fontWeight: '600',
                lineHeight: 13,
              }}
            >
              {item.caption}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  wrapTouchable(item, wrap, navigate) {
    if (wrap) {
      return <TouchableOpacity key="6" onPress={() => navigate()}>{item}</TouchableOpacity>;
    }
    return item;
  }

  renderInfoBlock() {
    const { profile, loading, navigation } = this.props;
    const infos = [];
    _.forOwn(getInfo(profile), (item, key) => {
      infos.push(
        this.wrapTouchable(
          <View
            key={item.label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 2,
              paddingBottom: 4,
            }}
          >
            <View style={{ width: 25, alignItems: 'center' }}>
              <IconAwe
                name={item.icon}
                style={{
                  fontSize: 11,
                  paddingRight: 15.36,
                  alignItems: 'center',
                  color: 'rgba(255,255,255,0.16)',
                }}
              />
            </View>
            <Text
              style={{
                color: 'white',
                fontFamily: 'OpenSans',
                fontSize: 11,
              }}
            >
              {item.label}
            </Text>
          </View>,
          key === '6',
          () => navigation.navigate('Network', { userId: profile.id, name: profile.name }),
        ),
      );
    });
    return (
      <View style={{ marginTop: 15 }}>
        {loading && Loader}
        {infos}
      </View>
    );
  }

  refresh(userId) {
    this.props.getUserFeed(userId);
  }

  loadMore(userId) {
    const { loadingUserFeed, userFeed } = this.props;

    if (loadingUserFeed) return;
    this.props.getUserFeed(userId, userFeed[userFeed.length - 1].id);
  }

  getDataForList(main, index = 0, size = 1) {
    const arr = main.slice(index, size + index);
    const result = arr.map(item => ({
      image: item.posterImage ? item.posterImage.medium : 'none',
      key: item.id,
      id: item.id,
    }));
    return result;
  }

  renderHeader() {
    const {
      profile,
      navigation,
      loading,
      loadingUserFeed,
      currentUser,
      favoritesLoading,
      favorite: { characters, anime, manga },
      entries,
    } = this.props;

    const { userId } = this.state;
    return (
      <View>
        <View
          style={{
            backgroundColor: colors.transparent,
            marginLeft: 23,
            marginRight: 23,
            marginBottom: 0,
            borderRadius: 5,
          }}
        >
          <View style={{ backgroundColor: colors.transparent, borderWidth: 0, paddingBottom: 16 }}>
            <View
              style={{
                paddingTop: 10,
                padding: 5,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.16)',
                alignItems: 'center',
                backgroundColor: colors.transparent,
              }}
            >
              <Text style={{ color: colors.white, fontFamily: 'OpenSans', fontSize: 12, lineHeight: 17 }}>
                {profile.about}
              </Text>
            </View>
            {this.renderInfoBlock()}
          </View>
        </View>
        <View
          style={{
            marginLeft: 9,
            marginRight: 9,
            marginBottom: 6,
          }}
        >
          <CardStatus
            leftText="Write Post"
            rightText="Share Photo"
            user={currentUser}
            toUser={profile}
          />
        </View>
        <View style={{ borderRadius: 5 }}>
          <CardFull single singleText="View Library" heading="Library Activity">
            {this.renderScrollableLibrary(entries.slice(0, 12), 110, true, 'entries')}
          </CardFull>
          <CardFull
            single
            singleText="View All Favorites"
            heading="Favorite Characters"
            onPress={() =>
              this.props.navigation.navigate('FavoriteCharacters', {
                label: 'Favorite Characters',
                userId,
              })}
          >
            {this.renderImageRow(
              characters.slice(0, 2),
              (Dimensions.get('window').width - 28) / 2,
              true,
              'characters',
            )}
            {this.renderImageRow(
              characters.slice(2, 5),
              (Dimensions.get('window').width - 28) / 3,
              true,
              'characters',
            )}
            {favoritesLoading.character && Loader}
            {characters.length === 0 &&
              !favoritesLoading.character &&
              <Text
                style={{
                  fontFamily: 'OpenSans',
                  fontSize: 12,
                  alignSelf: 'center',
                  textAlign: 'center',
                  padding: 30,
                }}
              >
                User has no favorites.
              </Text>}
          </CardFull>
          <CardTabs
            single
            singleText="View All Favorites"
            heading="Favorite Anime"
            onPress={() =>
              this.props.navigation.navigate('FavoriteMedia', {
                label: 'Favorite Media',
                userId,
              })}
          >
            {anime.length > 0
              ? <Grid tabLabel="Favorite Anime">
                <Col size={50}>
                  <ResultsList
                    dataArray={this.getDataForList(anime)}
                    numColumns={1}
                    imageSize={{
                      h: 234.78,
                      w: (Dimensions.get('window').width - 28)  * 0.5,
                    }}
                    scrollEnabled={false}
                    onPress={media =>
                        this.props.navigation.navigate('Media', {
                          mediaId: media.id,
                          type: 'anime',
                        })}
                  />
                </Col>
                <Col size={50}>
                  <View style={{ marginLeft: 2 }}>
                    <ResultsList
                      dataArray={this.getDataForList(anime, 1, 4)}
                      numColumns={2}
                      imageSize={{
                        h: 117.39,
                        w: Dimensions.get('window').width / 4,
                        m: 2,
                      }}
                      scrollEnabled={false}
                      onPress={media =>
                          this.props.navigation.navigate('Media', {
                            mediaId: media.id,
                            type: 'anime',
                          })}
                    />
                  </View>
                </Col>
              </Grid>
              : <View tabLabel="Favorite Anime">
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 12,
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: 50,
                  }}
                >
                    User has no favorites.
                  </Text>
              </View>}
            {manga.length > 0
              ? <Grid tabLabel="Favorite Manga">
                <Col size={45}>
                  <ResultsList
                    dataArray={this.getDataForList(manga)}
                    numColumns={1}
                    imageSize={{
                      h: 250,
                      w: Dimensions.get('window').width * 0.5,
                    }}
                    scrollEnabled={false}
                    onPress={media =>
                        this.props.navigation.navigate('Media', {
                          mediaId: media.id,
                          type: 'manga',
                        })}
                  />
                </Col>
                <Col size={55}>
                  <View style={{ marginTop: -2, marginLeft: 4 }}>
                    <ResultsList
                      dataArray={this.getDataForList(manga, 1, 4)}
                      numColumns={2}
                      imageSize={{
                        h: 127,
                        w: Dimensions.get('window').width / 3,
                        m: 2,
                      }}
                      scrollEnabled={false}
                      onPress={media =>
                          this.props.navigation.navigate('Media', {
                            mediaId: media.id,
                            type: 'manga',
                          })}
                    />
                  </View>
                </Col>
              </Grid>
              : <View tabLabel="Favorite Manga">
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 12,
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: 50,
                  }}
                >
                    User has no favorites.
                  </Text>
              </View>}
          </CardTabs>
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

  render() {
    const {
      profile,
      navigation,
      loading,
      loadingUserFeed,
      currentUser,
      favorite: { characters, anime, manga },
      entries,
    } = this.props;

    return (
      <Container style={styles.container}>
        <ParallaxScrollView
          backgroundColor='#fff0'
          contentBackgroundColor='#fff0'
          parallaxHeaderHeight={179}
          renderBackground={() => (
            <ProgressiveImage
              style={{
                width: Dimensions.get('window').width,
                height: 154,
                backgroundColor: '#fff0',
              }}
              resizeMode="cover"
              source={{ uri:  profile.coverImage && profile.coverImage.original || defaultCover }}
            />
          )}
          renderForeground={() => (
            <View style={{ marginTop: 109.14 }}>
              <ProgressiveImage
                source={{ uri: profile.avatar && profile.avatar.medium }}
                style={{
                  width: 69.86,
                  height: 69.86,
                  alignSelf: 'center',
                  borderRadius: 34.93,
                  backgroundColor: '#fff0',
                }}
              />
            </View>
          )}
        >
          <View style={{ width: Dimensions.get('window').width }}>
            <FlatList
              style={{ backgroundColor: colors.listBackPurple }}
              data={this.props.userFeed}
              ListHeaderComponent={() => this.renderHeader()}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <CardActivity {...item} />}
              onEndReached={() => this.loadMore(profile.id)}
              onEndReachedThreshold={0.5} />
            </View>
        </ParallaxScrollView>
        <CustomHeader
          style={styles.customHeader}
          navigation={navigation}
          headerImage={{ uri: profile.coverImage && profile.coverImage.original }}
          leftText={profile.name}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('ownProps', ownProps);
  const { profile, loading, character, manga, anime, library, favoritesLoading } = state.profile;
  const userId = ownProps.navigation.state.params
    && ownProps.navigation.state.params.userId;
  console.log('userId', userId);
  const { currentUser } = state.user;
  const c = (character[userId] && character[userId].map(({ item }) => item)) || [];
  const m = (manga[userId] && manga[userId].map(({ item }) => item)) || [];
  const a = (anime[userId] && anime[userId].map(({ item }) => item)) || [];
  const l = library[userId] || [];
  const { userFeed, loadingUserFeed } = state.feed;
  const filteredFeed = userFeed.filter(
    ({ activities }) => !['comment', 'follow'].includes(activities[0].verb),
  );
  console.log('map to state', filteredFeed, c, m, a, l, currentUser);
  return {
    loading,
    profile: profile[userId] || {},
    currentUser,
    favorite: {
      characters: [...c],
      manga: [...m],
      anime: [...a],
    },
    entries: [...l],
    favoritesLoading,
    userFeed: filteredFeed,
    loadingUserFeed,
  };
};

const styles = {
  container: {
    backgroundColor: colors.listBackPurple,
    justifyContent: 'center',
    alignItems: 'center',
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

ProfileScreen.propTypes = {
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  fetchProfileFavorites: PropTypes.func.isRequired,
  fetchLibraryEntires: PropTypes.func.isRequired,
  fetchProfile: PropTypes.func.isRequired,
  getUserFeed: PropTypes.func.isRequired,
};

const getInfo = (profile) => {
  const info = {};
  _.forOwn(profile, (value, key) => {
    if (value) {
      if (key === 'waifuOrHusbando') {
        let image = '';
        if (profile.waifu) {
          image = (
            <Image
              source={{ uri: profile.waifu.image.original }}
              style={{ width: 15, height: 15 }}
            />
          );
        }
        info['1'] = {
          label: <Text>{value} is {image} {profile.waifu && profile.waifu.name}</Text>,
          icon: 'heart',
          image,
        };
      }
      if (key === 'gender') {
        info['2'] = { label: `Gender is ${value}`, icon: 'venus-mars' };
      }
      if (key === 'location') {
        info['3'] = { label: `Lives is ${value}`, icon: 'map-marker' };
      }
      if (key === 'birthday') {
        info['4'] = {
          label: `Birthday is ${moment(value).format('MMMM Do')}`,
          icon: 'birthday-cake',
        };
      }
      if (key === 'createdAt') {
        info['5'] = { label: `Joined ${moment(value).fromNow()}`, icon: 'calendar' };
      }
      if (key === 'followersCount' && value > 0) {
        info['6'] = { label: `Followed by ${value} people`, icon: 'user' };
      }
      if (key === 'followingCount' && value > 0) {
        const label = `Following ${value} people`;
        if (info['6'].label.length > 0) {
          info['6'].label = `${info['6'].label}, ${label.toLowerCase()}`;
        } else {
          info['6'] = { label, icon: 'user' };
        }
      }
    }
  });
  return info;
};
export default connect(mapStateToProps, {
  fetchProfile,
  fetchProfileFavorites,
  fetchLibraryEntires,
  getUserFeed,
})(ProfileScreen);
