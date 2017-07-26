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
import { Button, Container, Content, Icon } from 'native-base';
import IconAwe from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import _ from 'lodash';

import CustomHeader from '../../components/CustomHeader';
import DoubleProgress from '../../components/DoubleProgress';
import CardStatus from '../../components/Card/CardStatus';
import CardFull from '../../components/Card/CardFull';
import CardActivity from '../../components/Card/CardActivity';
import ProgressiveImage from '../../components/ProgressiveImage';
import { defaultAvatar } from '../../constants/app';
import getTitleField from '../../utils/getTitleField';
import { fetchMedia, fetchMediaReviews, fetchMediaCastings } from '../../store/media/actions';

const { width } = Dimensions.get('window');

class MediaScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-body" android="md-body" style={{ fontSize: 20, color: tintColor }} />
    ),
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

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.animatedValue = new Animated.Value(0);
    this.renderEpisodes = this.renderEpisodes.bind(this);
    this.renderCharacters = this.renderCharacters.bind(this);
  }

  componentWillMount() {
    const { state } = this.props.navigation;
    const { mediaId, type } = state.params;
    this.props.fetchMedia(mediaId, type);
  }
  componentDidMount() {
    const { state } = this.props.navigation;
    const { mediaId, type } = state.params;
    this.props.fetchMediaReviews(mediaId);
    this.props.fetchMediaCastings(mediaId);
  }
  expand() {
    if (this.view) {
      if (this.state.expanded) {
        this.view.transition({ height: 200 }, { height: 70 }, 100, 'ease-in');
      } else {
        this.view.transition({ height: 70 }, { height: 200 }, 100, 'ease-in');
      }
      this.setState({ expanded: !this.state.expanded });
    }
  }

  renderScrollableRow(items) {
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
            style={{ margin: 2 }}
            onPress={media =>
              this.props.navigation.navigate('Media', {
                mediaId: item.media.id,
                type: item.media.type,
              })}
          >
            <ProgressiveImage source={{ uri: item.image }} style={{ height: 118, width: 83 }} />
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

  renderImageRow(data, height = 120, width = 85, type = 'media', hasCaption = false) {
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
            <ProgressiveImage source={{ uri: item.image }} style={{ height, width }} />
            {hasCaption &&
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.5)']}
                style={[{ height, width }, { position: 'absolute', top: 0 }]}
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

  renderEpisodes() {
    const { media, navigation } = this.props;
    const { type } = navigation.state.params;
    let series = type === 'anime' ? media.episodes || [] : media.chapters || [];
    series = series.sort((a, b) => a - b).slice(0, 12);
    const imageStyle = { height: 83, width: 148, borderRadius: 5 };
    if (series.length === 0) return;
    return (
      <View style={{ margin: 10 }}>
        <Text style={{ color: '#969696', fontSize: 10, marginLeft: 5 }}>
          EPISODES · {media.episodeCount}
        </Text>
        <ScrollView horizontal style={{ flexDirection: 'row' }}>
          {series.map((item, index) => (
            <View style={{ margin: 5 }} key={item.id}>
              <ProgressiveImage
                source={{ uri: item.thumbnail ? item.thumbnail.original : media.posterImage.large }}
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
                {item.titles.en_jp &&
                  <Text
                    style={{
                      color: 'white',
                      padding: 2,
                      paddingLeft: 0,
                      fontSize: 10,
                      fontFamily: 'OpenSans',
                    }}
                    numberOfLines={1}
                  >
                    {item.titles.en_jp || ''}
                  </Text>}
              </View>
            </View>
          ))}
          {media.episodeCount > 12 &&
            <View style={{ margin: 5 }}>
              <ProgressiveImage
                source={{ uri: media.posterImage.large }}
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

  renderRelatedMedia() {
    let more = [0, 1, 2, 3];
    const { mediaRelationships } = this.props.media;
    if (mediaRelationships && mediaRelationships.length === 0) return;
    if (mediaRelationships) {
      more = mediaRelationships.map((item) => {
        const title = item.destination.titles.en || item.destination.titles.en_jp;
        return {
          image: item.destination.posterImage.original,
          title,
          id: item.destination.id,
          type: item.destination.type,
          key: item.destination.id,
        };
      });
    }
    return (
      <CardFull single singleText="View All" heading="More from this series">
        {this.renderImageRow(more.slice(0, 12), 118, 83, 'media')}
      </CardFull>
    );
  }

  renderCharacters() {
    console.log(this.props);
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
        singleText="View All"
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
          _.uniqBy(characters, item => item.id).slice(0, 6),
          115,
          115,
          'character',
          true,
        )}
      </CardFull>
    );
  }

  render() {
    const { media, reviews, navigation, currentUser } = this.props;
    return (
      <Container style={styles.container}>
        <CustomHeader
          navigation={navigation}
          hasOverlay
          headerImage={{
            uri: media.coverImage && media.coverImage.original,
          }}
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
          right={
            <Button
              style={{
                justifyContent: 'center',
                zIndex: 100,
              }}
              transparent
              onPress={() => navigation.goBack()}
            >
              <IconAwe style={{ color: 'white', fontSize: 18 }} name="ellipsis-h" />
            </Button>
          }
        />
        <Content style={{ width, marginTop: 65 }}>
          <View
            style={{
              marginTop: 85,
              margin: 10,
              borderRadius: 5,
            }}
          >
            {reviews[0] &&
              <View style={{ marginTop: -30 }}>
                <ProgressiveImage
                  source={{
                    uri: reviews[0].user.avatar ? reviews[0].user.avatar.small : defaultAvatar,
                  }}
                  style={{ width: 30, height: 30, borderRadius: 15, marginBottom: 5 }}
                />
              </View>}
            <Text
              style={{
                color: 'white',
                fontSize: 10,
                fontWeight: '600',
                fontFamily: 'OpenSans',
                width: width / 1.70,
              }}
              numberOfLines={3}
            >
              {reviews[0] && reviews[0].content}
            </Text>
          </View>
          <View style={{ backgroundColor: '#F7F7F7', borderRadius: 0 }}>
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
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: 14,
                    fontFamily: 'OpenSans',
                  }}
                >
                  {(media.titles && media.titles[getTitleField()]) || media.canonicalTitle}
                  {' '}
                  <Text style={{ color: '#929292', fontSize: 12 }}>
                    {media.startDate && new Date(media.startDate).getFullYear()}
                  </Text>
                </Text>
                <Text style={{ color: '#929292', fontSize: 12, marginBottom: 5, marginTop: 3 }}>
                  {media.averageRating &&
                    <Text>
                      {media.averageRating}
                      %
                      {' '}
                    </Text>}
                  <Text style={{ color: '#575757', fontWeight: 'bold' }}>
                    {_.upperCase(media.subtype)}
                  </Text>
                </Text>
                {media.popularityRank &&
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconAwe
                      name="heart"
                      style={{ fontSize: 11, color: '#e74c3c', marginRight: 5 }}
                    />
                    <Text
                      style={{
                        color: '#464646',
                        fontWeight: '500',
                        fontFamily: 'OpenSans',
                        fontSize: 12,
                      }}
                    >
                      Rank #{media.popularityRank} (Most Popular)
                    </Text>
                  </View>}
                {media.ratingRank &&
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconAwe
                      name="star"
                      style={{ fontSize: 11, color: '#f39c12', marginRight: 5 }}
                    />
                    <Text
                      style={{
                        color: '#464646',
                        fontWeight: '500',
                        fontFamily: 'OpenSans',
                        fontSize: 12,
                      }}
                    >
                      Rank #{media.ratingRank} (Highest Rated Anime)
                    </Text>
                  </View>}
              </View>
              <View style={{ marginTop: -100, flex: 3 }}>
                <ProgressiveImage
                  source={{ uri: media.posterImage && media.posterImage.large }}
                  style={{ height: 167, width: 118, borderRadius: 3 }}
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
              {media.categories &&
                media.categories.map(item => (
                  <Button
                    style={{
                      height: 20,
                      borderColor: '#eaeaea',
                      backgroundColor: '#FFFFFF',
                      marginRight: 5,
                      marginBottom: 5,
                    }}
                    bordered
                    key={item.id}
                    light
                  >
                    <Text style={{ fontSize: 12, fontFamily: 'OpenSans' }}>{item.title}</Text>
                  </Button>
                ))}
            </View>
            <Animatable.View
              style={{ padding: 15, paddingTop: 0, height: 70, overflow: 'hidden', zIndex: 2 }}
              onPress={() => this.expand()}
              ref={el => (this.view = el)}
            >
              {!this.state.expanded &&
                <LinearGradient
                  colors={['rgba(247,247,247, 0.5)', '#f7f7f7']}
                  locations={[0.4, 1]}
                  onPress={() => this.expand()}
                  style={{ height: 30, width, position: 'absolute', bottom: 0, zIndex: 1 }}
                />}
              <Text
                onPress={() => this.expand()}
                style={{ fontSize: 11, color: '#333333', lineHeight: 15, fontFamily: 'OpenSans' }}
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
            {/*
            */}
            <CardStatus
              leftText="Write Post"
              rightText="Share Photo"
              user={currentUser}
              toUser={media}
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
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { navigation: { state: { params: { mediaId } } } } = ownProps;
  const { loading, media, reviews, castings } = state.media;
  const { currentUser } = state.user;
  return {
    loading,
    media: media[mediaId] || {},
    reviews: reviews[mediaId] || [],
    castings: castings[mediaId] || [],
    currentUser,
  };
};

const styles = {
  container: {
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

MediaScreen.propTypes = {
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  media: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { fetchMedia, fetchMediaReviews, fetchMediaCastings })(
  MediaScreen,
);
