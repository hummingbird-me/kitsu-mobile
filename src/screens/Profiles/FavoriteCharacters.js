import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Dimensions, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button, Container } from 'native-base';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { defaultAvatar } from 'kitsu/constants/app';
import { fetchProfileFavorites } from 'kitsu/store/profile/actions';
import { fetchMediaCastings } from 'kitsu/store/media/actions';

class FavoriteCharacter extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.label,
    headerLeft: (
      <Button transparent color="white" onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" style={{ color: 'white' }} />
      </Button>
    ),
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-body" android="md-body" style={{ fontSize: 24, color: tintColor }} />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      index: 0,
    };
  }

  componentDidMount() {
    console.log(this.props.navigation);
    const { mediaId } = this.props.navigation.state.params;
    if (mediaId) {
      this.props.fetchMediaCastings(mediaId);
    }
  }

  renderItem({ item, index }, imageSize) {
    let height = Dimensions.get('window').width / 3;
    let width = Dimensions.get('window').width / 3;
    if (index < 2) {
      height = Dimensions.get('window').width / 2;
      width = Dimensions.get('window').width / 2;
    }

    console.log(index);

    const image = item.image ? item.image.original : defaultAvatar;
    return (
      <View
        style={{
          height,
          width,
          margin: 2,
        }}
      >
        <ProgressiveImage
          source={{ uri: image }}
          style={{
            height,
            width,
          }}
          hasOverlay
        />
        {true &&
          <Text
            style={{
              color: 'white',
              fontWeight: '500',
              fontSize: 14,
              fontFamily: 'OpenSans',
              backgroundColor: 'transparent',
              alignSelf: 'center',
              marginTop: -25,
            }}
          >
            {item.name}
          </Text>}
      </View>
    );
  }

  renderTab(data) {
    const { fetchProfileFavorites, userId, loading } = this.props;
    if (data.length === 0) {
      return (
        <Text
          style={{
            fontFamily: 'OpenSans',
            fontSize: 12,
            alignSelf: 'center',
            textAlign: 'center',
            padding: 30,
          }}
        >
          No Characters.
        </Text>
      );
    }
    return (
      <FlatList
        removeClippedSubviews={false}
        data={data}
        keyExtractor={item => item.id}
        numColumns={4}
        refreshing={loading}
        onRefresh={() => fetchProfileFavorites(userId, 'characters')}
        renderItem={e => this.renderItem(e)}
      />
    );
  }

  render() {
    const data = this.props.characters.length > 0
      ? [
        ...this.props.characters.slice(0, 2),
        ...this.props.characters.slice(0, 2),
        ...this.props.characters.slice(2),
      ]
      : [];
    console.log(data);
    return (
      <Container>
        {this.renderTab(data)}
      </Container>
    );
  }
}

FavoriteCharacter.propTypes = {
  characters: PropTypes.array.isRequired,
  // navigation: PropTypes.object.isRequired,
};

const mapStateToProps = ({ profile, media }, ownProps) => {
  const { character, favoritesLoading } = profile;
  const { castings, loadingCastings } = media;
  const { navigation: { state: { params: { userId, mediaId } } } } = ownProps;
  let characters = [];
  let loading = false;
  if (userId) {
    characters = (character[userId] && character[userId].map(({ item }) => item)) || [];
    loading = favoritesLoading.character;
  } else {
    characters = (castings[mediaId] && castings[mediaId].map(item => item.character)) || [];
    loading = loadingCastings;
  }
  console.log(media);
  console.log(characters);
  return { characters, userId, loading };
};
export default connect(mapStateToProps, { fetchProfileFavorites, fetchMediaCastings })(
  FavoriteCharacter,
);
