import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button, Container } from 'native-base';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import SimpleTabBar from '../../components/SimpleTabBar';
import ProgressiveImage from '../../components/ProgressiveImage';
import { fetchProfileFavorites } from '../../store/profile/actions';

class FavoriteMedia extends Component {
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
      index: 0,
      mangaloading: false,
      animeloading: false,
    };
    this.loadMore = this.loadMore.bind(this);
  }

  loadMore(type) {
    const { query, active, index } = this.state;
    const { loading, fetchProfileFavorites, userId } = this.props;
    if (!this.state[`${type}loading`]) {
      const page = index + 1;
      this.setState({ index: page, [`${type}loading`]: true });
      fetchProfileFavorites(userId, type, 20, page);
    }
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.anime !== this.props.anime) {
    //   this.setState({ animeloading: false });
    // }
    // if (nextProps.manga !== this.props.manga) {
    //   this.setState({ mangaloading: false });
    // }
  }

  renderItem({ item, index }) {
    let height = Dimensions.get('window').width / 3;
    let width = Dimensions.get('window').width / 4 - 7;
    if (index < 2) {
      height = Dimensions.get('window').width / 1.5;
      width = Dimensions.get('window').width / 2 - 10;
    }
    const image = item.posterImage ? item.posterImage.original : '';
    return (
      <TouchableOpacity
        style={{
          height,
          width,
          margin: 2,
        }}
        onPress={() =>
          this.props.navigation.navigate('Media', {
            mediaId: item.id,
            type: item.type,
          })}
      >
        <ProgressiveImage
          source={{ uri: image }}
          style={{
            height,
            width,
          }}
        />
      </TouchableOpacity>
    );
  }

  renderTab(type) {
    const { userId, loading, fetchProfileFavorites } = this.props;
    return (
      <FlatList
        removeClippedSubviews={false}
        keyExtractor={item => item.id}
        data={this.getData(this.props[type])}
        numColumns={4}
        onEndReached={() => console.log(type)}
        onEndReachedThreshold={0.5}
        refreshing={loading[type]}
        onRefresh={() => fetchProfileFavorites(userId, type)}
        renderItem={e => this.renderItem(e)}
      />
    );
  }

  getData(main) {
    return main.length > 0
      ? [...main.slice(0, 2), ...main.slice(0, 2), ...main.slice(2)]
      : Array(20).fill(1).map((item, index) => ({ key: index }));
  }

  render() {
    return (
      <Container>
        <ScrollableTabView renderTabBar={() => <SimpleTabBar />}>
          <View tabLabel="Anime" style={{ padding: 5, paddingTop: 0, backgroundColor: 'white' }}>
            {this.renderTab('anime')}
          </View>
          <View tabLabel="Manga" style={{ padding: 5, paddingTop: 0, backgroundColor: 'white' }}>
            {this.renderTab('manga')}
          </View>
        </ScrollableTabView>
      </Container>
    );
  }
}

FavoriteMedia.propTypes = {
  anime: PropTypes.array.isRequired,
  manga: PropTypes.array.isRequired,
  loading: PropTypes.object.isRequired,
};

const mapStateToProps = ({ profile }, ownProps) => {
  const { manga, anime, favoritesLoading } = profile;
  const { navigation: { state: { params: { userId } } } } = ownProps;
  console.log(anime[userId]);
  const animes = (anime[userId] && anime[userId].map(({ item }) => item)) || [];
  const mangas = (manga[userId] && manga[userId].map(({ item }) => item)) || [];
  return {
    userId,
    anime: animes,
    manga: mangas,
    loading: {
      anime: favoritesLoading.anime,
      manga: favoritesLoading.manga,
    },
  };
};
export default connect(mapStateToProps, { fetchProfileFavorites })(FavoriteMedia);
