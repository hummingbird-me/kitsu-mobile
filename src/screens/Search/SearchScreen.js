import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Container, Icon, Text, Item, Input } from 'native-base';
import PropTypes from 'prop-types';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import _ from 'lodash';

import * as colors from '../../constants/colors';

import { search } from '../../store/anime/actions';
import { ResultsList, TopsList, UsersList } from './Lists';
import SegmentTabBar from '../../components/SegmentTabBar';

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

  constructor(props) {
    super(props);

    this.state = {
      active: 'anime',
      query: '',
      index: 0,
    };

    this.segmentChange = this.segmentChange.bind(this);
    this.search = this.search.bind(this);
    this.handleSearchQuery = this.handleSearchQuery.bind(this);
    this.renderSearchBar = this.renderSearchBar.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  segmentChange(e, active) {
    this.setState({ active });
    this.search(this.state.query, active);
  }

  search(query, active, index = 0) {
    if (query.length > 0) {
      this.props.search({ text: query }, {}, index, null, active);
      // _.debounce(() => this.props.search({ text: query }, {}, index, null, active), 1000);
    }
  }

  loadMore() {
    const { query, active } = this.state;
    if (!this.props.loading) {
      const index = this.state.index + 1;
      this.search(query, active, index);
      this.setState({ index });
    }
  }

  refresh() {
    this.setState({ loading: true, index: 0 });
    const { query, active } = this.state;
    if (query.length > 0) {
      this.search(query, active);
    }
  }

  handleSearchQuery(query) {
    this.setState({ query });
    this.search(query, this.state.active);
  }

  renderSearchBar(active) {
    const { query } = this.state;

    return (
      <Item
        style={{
          height: 36,
          backgroundColor: colors.white,
          paddingLeft: 14,
          paddingRight: 14,
          borderColor: colors.imageGrey,
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginLeft: 9,
          marginRight: 9,
        }}
      >
        <Icon
          name="ios-search"
          style={{ color: '#9D9D9D', fontSize: 17, alignItems: 'center', marginTop: 5 }}
        />
        <Input
          placeholder={`Search ${active}`}
          value={query}
          onChangeText={this.handleSearchQuery}
          style={{
            fontSize: 13,
            fontFamily: 'OpenSans',
            color: colors.placeholderGrey,
            alignSelf: 'center',
            textAlign: 'center',

          }}
          placeholderTextColor={colors.placeholderGrey}
        />
      </Item>
    );
  }

  render() {
    const { query, selected } = this.state;
    const { resultsanime, resultsmanga, loading } = this.props;
    return (
      <Container style={{ backgroundColor: '#FAFAFA' }}>

        <ScrollableTabView
          renderTabBar={() => <SegmentTabBar style={{ marginRight: 28, marginLeft: 28 }}/>}
          prerenderingSiblingsNumber={1}
          onChangeTab={(e) => {
            this.setState({ selected: e.i, active: e.ref.props.id });
            this.search(this.state.query, e.ref.props.id);
          }}
        >
          <ScrollView key="Anime" tabLabel="Anime" id="anime" style={styles.scrollView}>
            {this.renderSearchBar('anime')}
            {query.length === 0
              ? <TopsList
                active="anime"
                mounted={selected === 0}
                navigation={this.props.navigation}
              />
              : <ResultsList
                dataArray={resultsanime}
                loading={loading}
                loadMore={this.loadMore}
                refresh={this.refresh}
              />}
          </ScrollView>
          <ScrollView key="Manga" tabLabel="Manga" id="manga" style={styles.scrollView}>
            {this.renderSearchBar('manga')}
            {query.length === 0
              ? <TopsList
                active="manga"
                mounted={selected === 1}
                navigation={this.props.navigation}
              />
              : <ResultsList
                dataArray={resultsmanga}
                loading={loading}
                loadMore={this.loadMore}
                refresh={this.refresh}
              />}
          </ScrollView>
          <ScrollView key="Users" tabLabel="Users" style={styles.scrollView}>
            {this.renderSearchBar('users')}
            <UsersList />
          </ScrollView>
        </ScrollableTabView>
      </Container>
    );
  }
}

const mapStateToProps = ({ anime }) => {
  const { resultsanime, resultsmanga, resultsLoading } = anime;
  let animeR = [];
  let mangaR = [];
  if (resultsanime.length > 0) {
    animeR = resultsanime.map(item => ({
      image: item.posterImage ? item.posterImage.small : 'none',
      titles: item.titles ? item.titles : {},
      key: item.id,
    }));
  } else {
    animeR = Array(20).fill(1).map((item, index) => ({ key: index }));
  }
  if (resultsmanga.length > 0) {
    mangaR = resultsmanga.map(item => ({
      image: item.posterImage ? item.posterImage.small : 'none',
      titles: item.titles ? item.titles : {},
      key: item.id,
    }));
  } else {
    mangaR = Array(20).fill(1).map((item, index) => ({ key: index }));
  }
  return { resultsanime: animeR, resultsmanga: mangaR, loading: resultsLoading };
};

const styles = {
  scrollView: {
    backgroundColor: colors.listBackPurple,
  },
};
SearchScreen.propTypes = {
  resultsanime: PropTypes.array.isRequired,
  resultsmanga: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  search: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, { search })(SearchScreen);
