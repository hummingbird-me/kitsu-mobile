import React, { PureComponent } from 'react';
import { Navigation } from 'react-native-navigation';
import { View, ScrollView, Keyboard, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { connect } from 'react-redux';
import algolia from 'algoliasearch/reactnative';
import { capitalize, isEmpty, isNull, debounce, isEqual } from 'lodash';
import UsersList from 'kitsu/screens/Search/Lists/UsersList';
import { kitsuConfig } from 'kitsu/config/env';
import { followUser } from 'kitsu/store/user/actions';
import { captureUsersData } from 'kitsu/store/users/actions';
import { ResultsList, TopsList } from 'kitsu/screens/Search/Lists';
import { SearchBox } from 'kitsu/components/SearchBox';
import { StyledText } from 'kitsu/components/StyledText';
import { Screens } from 'kitsu/navigation';
import { styles } from './styles';

class SearchScreen extends PureComponent {
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
  };

  componentWillMount() {
    this.updateScenes();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.algoliaKeys, nextProps.algoliaKeys)) {
      this.updateScenes(nextProps.algoliaKeys);
    }
  }

  updateScenes(keys = this.props.algoliaKeys) {
    const media = keys && keys.media;
    const users = keys && keys.users;

    this.scenes = {
      anime: {
        apiKey: media && media.key,
        indexName: media && media.index,
        kind: 'anime',
      },
      manga: {
        apiKey: media && media.key,
        indexName: media && media.index,
        kind: 'manga',
      },
      users: {
        apiKey: users && users.key,
        indexName: users && users.index,
      },
    };
  }

  handleQuery = (scene, query) => {
    const nextState = { ...this.state.query, [scene]: isEmpty(query) ? undefined : query };
    this.setState({ query: nextState }, () => {
      this.debouncedSearch(query, scene);
    });
  };

  executeSearch = (query, scene) => {
    const currentScene = this.scenes[scene];
    if (isEmpty(currentScene.apiKey)) { return; }

    const client = algolia(kitsuConfig.algoliaAppId, currentScene.apiKey);
    const index = client.initIndex(currentScene.indexName);
    const filters = currentScene.kind ? `kind:${currentScene.kind}` : '';
    index.search({ query, filters}, (err, content) => {
      if (!err) {
        this.setState({
          searchResults: {
            ...this.state.searchResults,
            [scene]: content.hits,
          },
        });
      }
    });
  };
  debouncedSearch = debounce(this.executeSearch, 150);

  navigateToMedia = (media) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: Screens.MEDIA_PAGE,
        passProps: {
          mediaId: media.id,
          mediaType: media.kind,
        },
      },
    });
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
    const scenes = Object.keys(this.scenes);
    return scenes.map((scene) => {
      const label = capitalize(scene);
      return (
        <View key={scene} style={styles.contentContainer} tabLabel={label}>
          <SearchBox
            placeholder={`Search ${label}`}
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
    const { navigation, followUser, captureUsersData, componentId } = this.props;
    const hits = this.state.searchResults[scene] || [];

    switch (scene) {
      case 'users': {
        return (
          <UsersList
            hits={hits}
            onFollow={followUser}
            onData={captureUsersData}
            componentId={componentId}
          />
        );
      }
      case 'anime':
      case 'manga': {
        return isEmpty(query[scene]) ? (
          <TopsList
            mounted
            active={scene}
            componentId={componentId}
          />
        ) : (
          <ResultsList
            style={styles.list}
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
    const { initialPage } = this.props;
    return (
      <ScrollableTabView
        style={styles.container}
        initialPage={initialPage || 0}
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
  algoliaKeys: PropTypes.shape({
    media: PropTypes.shape(AlgoliaPropType),
    users: PropTypes.shape(AlgoliaPropType),
  }),
  initialPage: PropTypes.number,
};

SearchScreen.defaultProps = {
  algoliaKeys: null,
  initialPage: 0,
};

const mapper = (state) => {
  const { app: { algoliaKeys }, user: { currentUser } } = state;
  return { algoliaKeys, currentUser };
};

export default connect(mapper, { followUser, captureUsersData })(SearchScreen);
