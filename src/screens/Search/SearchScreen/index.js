import React, { PureComponent } from 'react';
import { View, ScrollView, Keyboard, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import algolia from 'algoliasearch/reactnative';
import { capitalize, isEmpty, isNull, debounce } from 'lodash';
import UsersList from 'kitsu/screens/Search/Lists/UsersList';
import { kitsuConfig } from 'kitsu/config/env';
import { followUser } from 'kitsu/store/user/actions';
import { captureUsersData } from 'kitsu/store/users/actions';
import { ResultsList, TopsList } from 'kitsu/screens/Search/Lists';
import { SearchBox } from 'kitsu/components/SearchBox';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

class SearchScreen extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  state = {
    isScrollingScene: false,
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
    scenes: {
      anime: {
        apiKey: this.props.algoliaKeys.media && this.props.algoliaKeys.media.key,
        indexName: this.props.algoliaKeys.media && this.props.algoliaKeys.media.index,
        kind: 'anime',
      },
      manga: {
        apiKey: this.props.algoliaKeys.media && this.props.algoliaKeys.media.key,
        indexName: this.props.algoliaKeys.media && this.props.algoliaKeys.media.index,
        kind: 'manga',
      },
      users: {
        apiKey: this.props.algoliaKeys.users && this.props.algoliaKeys.users.key,
        indexName: this.props.algoliaKeys.users && this.props.algoliaKeys.users.index,
      },
    },
  };

  handleQuery = (scene, query) => {
   const nextState = { ...this.state.query, [scene]: isEmpty(query) ? undefined : query };
   this.setState({ query: nextState }, () => {
     this.debouncedSearch(query, scene);
   });
  };

  executeSearch = (query, scene) => {
    const currentScene = this.state.scenes[scene];
    if (isNull(currentScene.apiKey)) { return; }

    const client = algolia(kitsuConfig.algoliaAppId, currentScene.apiKey);
    const index = client.initIndex(currentScene.indexName);
    const filters = currentScene.kind ? `kind:${currentScene.kind}` : '';
    index.search({ query, filters}, (err, content) => {
      if (!err) {
        this.setState({ searchResults: { [scene]: content.hits } });
      }
    });
  };
  debouncedSearch = debounce(this.executeSearch, 150);

  navigateToMedia = (media) => {
    this.props.navigation.navigate('MediaPages', {
      mediaId: media.id,
      mediaType: media.kind,
    });
  };

  handleSceneScroll = (value) => {
    this.setState({ isScrollingScene: value });
  };

  renderTabBar = ({ tabs, activeTab, goToPage }) => (
    <View style={styles.tabBar}>
      {tabs.map((name, page) => {
        const isTabActive = activeTab === page;
        return this.renderTabItem(name, page, isTabActive, goToPage);
      })}
    </View>
  );

  renderTabItem = (name, page, active, goToPage) => (
    <TouchableOpacity key={name} style={styles.tabBarItem} onPress={() => goToPage(page)}>
      <StyledText color={active ? 'orange' : 'grey'} size="xsmall" bold>
        {name}
      </StyledText>
    </TouchableOpacity>
  );

  renderScenes = () => {
    const scenes = Object.keys(this.state.scenes);
    return scenes.map((scene) => {
      const label = capitalize(scene);
      return (
        <View key={scene} style={styles.contentContainer} tabLabel={label}>
          <SearchBox
            placeholder={`Search ${label}`}
            searchIconOffset={108}
            style={styles.searchBox}
            value={this.state.query[scene]}
            onChangeText={t => this.handleQuery(scene, t)}
            onSubmitEditing={() => Keyboard.dismiss()}
            returnKeyType="search"
          />
          <ScrollView
            contentContainerStyle={styles.scrollViewContentContainer}
            style={styles.scrollView}
          >
            {this.renderSubScene(scene)}
          </ScrollView>
        </View>
      );
    });
  };

  renderSubScene = (scene) => {
    const { query } = this.state;
    const { navigation, followUser, captureUsersData } = this.props;
    const hits = this.state.searchResults[scene];

    switch (scene) {
      case 'users': {
        return <UsersList
          hits={hits}
          onFollow={followUser}
          onData={captureUsersData}
          navigation={navigation}
        />
      }
      case 'anime':
      case 'manga': {
        return isEmpty(query[scene]) ? (
          <TopsList
            mounted
            onScroll={this.handleSceneScroll}
            active={scene}
            navigation={navigation}
          />
        ) : (
          <ResultsList
            hits={hits}
            onPress={this.navigateToMedia}
            currentUser={this.props.currentUser}
          />
        );
      }
      default: {
        console.error('Invalid scene passed to renderSubScene()');
        return null;
      }
    }
  };

  render() {
    const { params } = this.props.navigation.state;
    return (
      <ScrollableTabView
        style={styles.container}
        initialPage={(params && params.initialPage) || 0}
        renderTabBar={this.renderTabBar}
        locked={Platform.OS === 'android'}
      >
        {this.renderScenes()}
      </ScrollableTabView>
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
  const { app: { algoliaKeys }, user: { currentUser } } = state;
  return { algoliaKeys, currentUser };
};

export default connect(mapper, { followUser, captureUsersData })(SearchScreen);
