import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Container, Icon } from 'native-base';
import { InstantSearch } from 'react-instantsearch/native';
import { connectInfiniteHits } from 'react-instantsearch/connectors';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { SearchBar } from 'kitsu/components/SearchBar';
import { kitsuConfig } from 'kitsu/config/env';
import * as colors from 'kitsu/constants/colors';
import { ResultsList, TopsList } from './Lists';

const styles = {
  container: {
    backgroundColor: colors.listBackPurple,
    flex: 1,
  },
  scrollView: {
    backgroundColor: colors.listBackPurple,
  },
  tabBar: {
    backgroundColor: colors.listBackPurple,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    height: 40,
    paddingRight: 5,
    paddingLeft: 5,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    marginRight: 28,
    marginLeft: 28,
  },
  tabBarItem: {
    height: 27,
    marginTop: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  tabBarTextActive: {
    color: colors.tabbarSelectedTextColor,
    fontFamily: 'OpenSans',
    fontWeight: '600',
    opacity: 1,
    fontSize: 12,
  },
  tabBarText: {
    color: '#ffffff',
    fontFamily: 'OpenSans',
    fontWeight: '600',
    opacity: 0.6,
    fontSize: 12,
  },
};

const Hits = connectInfiniteHits(ResultsList);

class SearchScreen extends Component {
  static navigationOptions = {
    title: 'Search',
    headerStyle: {
      backgroundColor: colors.darkPurple,
      shadowOpacity: 0,
      height: 0,
    },
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-search" android="md-search" style={{ fontSize: 24, color: tintColor }} />
    ),
  };

  state = {
    query: undefined,
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
        apiKey: this.props.algoliaKeys.posts.key,
        indexName: this.props.algoliaKeys.posts.index,
      },
      {
        key: 'users',
        title: 'Users',
        apiKey: this.props.algoliaKeys.users.key,
        indexName: this.props.algoliaKeys.users.index,
      },
    ],
  };

  renderScene = ({ route }) => (
    <InstantSearch
      appId={kitsuConfig.algoliaAppId}
      apiKey={route.apiKey}
      indexName={route.indexName}
      onSearchStateChange={this.handleSearchStateChange}
    >
      <SearchBar placeholder={`Search ${route.title}`} searchIconOffset={108} />
      {this.renderSubScene(route)}
    </InstantSearch>
  );

  renderSubScene = (route) => {
    const { query } = this.state;
    const { navigation } = this.props;

    switch (route.key) {
      case 'users':
        return (
          <View>
            {query && <Hits />}
          </View>
        );
      default: {
        return (
          <ScrollView style={styles.scrollView}>
            {!query && <TopsList active={route.key} mounted navigation={navigation} />}
            {query && <Hits />}
          </ScrollView>
        );
      }
    }
  };

  handleSearchStateChange = (searchState) => {
    const { query } = searchState;
    this.setState({ query: query !== '' ? query : undefined });
  };

  handleIndexChange = index => this.setState({ index });

  renderIndicator = () => <View />;

  renderLabel = ({ route }) => {
    let labelTextStyle = styles.tabBarText;
    if (parseInt(route.key, 10) === this.state.index + 1) {
      labelTextStyle = { ...styles.tabBarText, ...styles.tabBarTextActive };
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
      <Container style={styles.container}>
        <TabViewAnimated
          style={{ flex: 1 }}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderHeader={this.renderHeader}
          onIndexChange={this.handleIndexChange}
        />
      </Container>
    );
  }
}

const mapper = (state) => {
  const { algoliaKeys } = state.app;
  return {
    algoliaKeys,
  };
};

export default connect(mapper, {})(SearchScreen);
