import React, { Component } from 'react';
import { View, Text, ScrollView, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';
import algolia from 'algoliasearch/reactnative';

import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';

import UsersList from 'kitsu/screens/Search/Lists/UsersList';
import { kitsuConfig } from 'kitsu/config/env';

import { followUser } from 'kitsu/store/user/actions';
import { captureUsersData } from 'kitsu/store/users/actions';
import { ResultsList, TopsList } from 'kitsu/screens/Search/Lists';
import { SearchBox } from 'kitsu/components/SearchBox';

import { styles } from './styles';

class SearchScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    shouldTabRender: false,
    query: {
      anime: undefined,
      manga: undefined,
      users: undefined,
    },
    searchResults: {
      anime: [],
      manga: [],
      users: [],
    },
    index: 0,
    routes: [
      {
        key: 'anime',
        title: 'Anime',
        apiKey: this.props.algoliaKeys.media.key,
        indexName: this.props.algoliaKeys.media.index,
      },
      {
        key: 'manga',
        title: 'Manga',
        apiKey: this.props.algoliaKeys.media.key,
        indexName: this.props.algoliaKeys.media.index,
      },
      {
        key: 'users',
        title: 'Users',
        apiKey: this.props.algoliaKeys.users.key,
        indexName: this.props.algoliaKeys.users.index,
      },
    ],
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions().then(() => {
      this.setState({ shouldTabRender: true });
    });
  }

  doSearch = (query, route) => {
    const algoliaClient = algolia(kitsuConfig.algoliaAppId, route.apiKey);
    const algoliaIndex = algoliaClient.initIndex(route.indexName);

    algoliaIndex.search(query, (err, content) => {
      if (!err) {
        this.setState({ searchResults: { [route.key]: content.hits } });
        // Push users to redux store for data persistance across the app.
        if (route.key === 'users') {
          this.props.captureUsersData(content.hits);
        }
      }
    });
  };

  handleSearchStateChange = (route, query) => {
    // const { query } = searchState;
    const nextQueryState = { ...this.state.query, [route.key]: query !== '' ? query : undefined };
    this.setState({ query: nextQueryState }, () => {
      this.doSearch(query, route);
    });
  };

  handleIndexChange = index => this.setState({ index });

  navigateToMedia = (media) => {
    this.props.navigation.navigate('Media', {
      mediaId: media.id,
      type: media.type,
    });
  };

  renderScene = ({ route }) => {
    const currentValue = this.state.query[route.key];

    return (
      <View>
        <SearchBox
          placeholder={`Search ${route.title}`}
          searchIconOffset={108}
          style={styles.searchBox}
          value={currentValue}
          onChangeText={t => this.handleSearchStateChange(route, t)}
        />
        <ScrollView
          contentContainerStyle={styles.scrollViewContentContainer}
          style={styles.scrollView}
        >
          {this.state.shouldTabRender && this.renderSubScene({ route })}
        </ScrollView>
      </View>
    );
  };

  renderSubScene = ({ route }) => {
    const { query } = this.state;
    const { navigation, followUser, captureUsersData } = this.props;

    const activeQuery = query[route.key];
    const hits = this.state.searchResults[route.key];

    switch (route.key) {
      case 'users': {
        return <UsersList users={this.props.users} onFollow={followUser} />;
      }
      default: {
        return activeQuery ? (
          <ResultsList hits={hits} onPress={this.navigateToMedia} />
        ) : (
          <TopsList active={route.key} mounted navigation={navigation} />
        );
      }
    }
  };

  renderIndicator = () => <View />;

  renderLabel = ({ route }) => {
    const labelTextStyle = [styles.tabBarText];
    const activeRoute = this.state.routes[this.state.index];
    if (route.key === activeRoute.key) {
      labelTextStyle.push(styles.tabBarTextActive);
    }

    return (
      <View style={styles.tabBarItem}>
        <Text style={labelTextStyle}>{route.title}</Text>
      </View>
    );
  };

  renderHeader = props => (
    <TabBar
      {...props}
      style={styles.tabBar}
      renderIndicator={this.renderIndicator}
      renderLabel={this.renderLabel}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <TabViewAnimated
          style={{ flex: 1 }}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderHeader={this.renderHeader}
          onIndexChange={this.handleIndexChange}
        />
      </View>
    );
  }
}

const AlgoliaPropType = {
  key: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
};

SearchScreen.propTypes = {
  algoliaKeys: PropTypes.shape(AlgoliaPropType).isRequired,
};

const mapper = (state) => {
  const { algoliaKeys } = state.app;
  const { users } = state;

  return {
    algoliaKeys,
    users,
  };
};

export default connect(mapper, { followUser, captureUsersData })(SearchScreen);
