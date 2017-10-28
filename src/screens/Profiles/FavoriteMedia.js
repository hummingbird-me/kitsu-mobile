import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, FlatList } from 'react-native';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ScrollableTabBar } from 'kitsu/components/ScrollableTabBar';
import { fetchProfileFavorites } from 'kitsu/store/profile/actions';
import { ProfileHeader } from 'kitsu/components/ProfileHeader';

const renderTabBar = () => <ScrollableTabBar />;

class FavoriteMedia extends Component {
  static navigationOptions = (props) => {
    const { profile } = props.navigation.state.params;

    return {
      headerStyle: {
        shadowColor: 'transparent',
        elevation: 0,
      },
      header: () => (
        <ProfileHeader
          profile={profile}
          title={profile.name}
          onClickBack={props.navigation.goBack}
        />
      ),
    };
  };

  state = {
    index: 0,
    mangaloading: false,
    animeloading: false,
  }

  loadMore = (type) => {
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
      null
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
      <View style={{ flex: 1 }}>
        <ScrollableTabView renderTabBar={renderTabBar}>
          <View tabLabel="Anime" style={{ padding: 5, paddingTop: 0, backgroundColor: 'white' }}>
            {this.renderTab('anime')}
          </View>
          <View tabLabel="Manga" style={{ padding: 5, paddingTop: 0, backgroundColor: 'white' }}>
            {this.renderTab('manga')}
          </View>
        </ScrollableTabView>
      </View>
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
  // console.log(anime[userId]);
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
