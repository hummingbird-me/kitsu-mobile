import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import algolia from 'algoliasearch/reactnative';
import UsersList from 'kitsu/screens/Search/Lists/UsersList';
import { kitsuConfig } from 'kitsu/config/env';
import { followUser } from 'kitsu/store/user/actions';
import { captureUsersData } from 'kitsu/store/users/actions';
import { ResultsList, TopsList } from 'kitsu/screens/Search/Lists';
import { SearchBox } from 'kitsu/components/SearchBox';
import { StyledText } from 'kitsu/components/StyledText';

import { styles } from './styles';

class SearchScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
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
        kind: 'anime',
      },
      {
        key: 'manga',
        title: 'Manga',
        apiKey: this.props.algoliaKeys.media.key,
        indexName: this.props.algoliaKeys.media.index,
        kind: 'manga',
      },
      {
        key: 'users',
        title: 'Users',
        apiKey: this.props.algoliaKeys.users.key,
        indexName: this.props.algoliaKeys.users.index,
      },
    ],
  };

  doSearch = (query, route) => {
    const algoliaClient = algolia(kitsuConfig.algoliaAppId, route.apiKey);
    const algoliaIndex = algoliaClient.initIndex(route.indexName);

    const filters = route.kind ? `kind:${route.kind}` : '';

    algoliaIndex.search({ query, filters }, (err, content) => {
      if (!err) {
        this.setState({ searchResults: { [route.key]: content.hits } });
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
    this.props.navigation.navigate('MediaPages', {
      mediaId: media.id,
      mediaType: media.kind,
    });
  };

  renderScene = ({ route }) => {
    const currentValue = this.state.query[route.key];

    return (
      // Applying the width style stops the view from clipping outside the screen
      // When the SearchScreen is initially loaded.
      <View style={{ width: Dimensions.get('screen').width }}>
        <SearchBox
          placeholder={`Search ${route.title}`}
          searchIconOffset={108}
          style={styles.searchBox}
          value={currentValue}
          onChangeText={t => this.handleSearchStateChange(route, t)}
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <ScrollView
          contentContainerStyle={styles.scrollViewContentContainer}
          style={styles.scrollView}
        >
          {this.renderSubScene({ route })}
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
        return <UsersList hits={hits} onFollow={followUser} onData={captureUsersData} navigation={navigation} />;
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

  renderIndicator = () => null;

  renderLabel = ({ route }) => {
    const activeRoute = this.state.routes[this.state.index];

    return (
      <View style={styles.tabBarItem}>
        <View style={styles.textContainer}>
          <StyledText color={route.key === activeRoute.key ? 'orange' : 'grey'} size="xsmall" bold>
            {route.title}
          </StyledText>
        </View>
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
  value: PropTypes.string.isRequired,
};

SearchScreen.propTypes = {
  algoliaKeys: PropTypes.shape(AlgoliaPropType).isRequired,
};

const mapper = (state) => {
  const { algoliaKeys } = state.app;
  return {
    algoliaKeys,
  };
};

export default connect(mapper, { followUser, captureUsersData })(SearchScreen);
