import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Icon,
  Segment,
  Button,
  Text,
  StyleProvider,
  Item,
  Input,
} from 'native-base';
import PropTypes from 'prop-types';

import * as colors from '../../constants/colors';
import getTheme from '../../../native-base-theme/components';
import kitsuStyles from '../../../native-base-theme/variables/kitsu';
import { search } from '../../store/anime/actions';
import { ResultsList, TopsList } from './Lists';

class SearchScreen extends Component {
  static navigationOptions = {
    title: 'Search',
    headerStyle: {
      backgroundColor: colors.darkPurple,
      shadowOpacity: 0,
      height: 50,
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
  }

  segmentChange(e, active) {
    this.setState({ active });
    this.search(this.state.query, active);
  }

  search(query, active, index = 0) {
    this.props.search({ text: query }, {}, index, null, active);
  }

  loadMore() {
    if (!this.props.loading) {
      const index = this.state.index + 1;
      this.search(index);
      this.setState({ index });
    }
  }

  refresh() {
    this.setState({ loading: true, index: 0 });
    const { query, active } = this.state;
    this.search(query, active);
  }

  handleSearchQuery(query) {
    this.setState({ query });
    this.search(query, this.state.active);
  }

  render() {
    const { active, query } = this.state;
    const { results } = this.props;
    return (
      <Container>
        <StyleProvider style={getTheme(kitsuStyles)}>
          <Segment
            style={{
              backgroundColor: colors.darkPurple,
              borderTopWidth: 0,
              height: 44,
              shadowColor: 'black',
              shadowOpacity: 0.1,
              shadowRadius: StyleSheet.hairlineWidth,
            }}
          >
            <Button
              style={{ height: 28, marginTop: 0 }}
              active={active === 'anime'}
              onPress={e => this.segmentChange(e, 'anime')}
              first
            >
              <Text>Anime</Text>
            </Button>
            <Button
              style={{ height: 28, marginTop: 0 }}
              onPress={e => this.segmentChange(e, 'manga')}
              active={active === 'manga'}
            >
              <Text>Manga</Text>
            </Button>
            <Button
              style={{ height: 28, marginTop: 0 }}
              onPress={e => this.segmentChange(e, 'users')}
              active={active === 'users'}
              last
            >
              <Text>Users</Text>
            </Button>
          </Segment>
        </StyleProvider>
        <Content style={{ backgroundColor: '#FAFAFA' }}>
          <Item
            style={{ height: 36, backgroundColor: '#FAFAFA', paddingLeft: 14, paddingRight: 14 }}
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
                fontWeight: '600',
                color: colors.placeholderGrey,
                alignSelf: 'center',
              }}
              placeholderTextColor={colors.placeholderGrey}
            />
          </Item>
          {query.length === 0
            ? <TopsList active={active} navigation={this.props.navigation} />
            : <ResultsList dataArray={results} />}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ anime }) => {
  const { results, resultsLoading } = anime;
  let data = [];
  if (results.length > 0) {
    data = results.map(item => ({
      image: item.posterImage ? item.posterImage.small : 'none',
      titles: item.titles ? item.titles : {},
      key: item.id,
    }));
  } else {
    data = Array(20).fill(1).map((item, index) => ({ key: index }));
  }
  return { results: data, loading: resultsLoading };
};

SearchScreen.propTypes = {
  results: PropTypes.array.isRequired,
  navigation: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  search: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, { search })(SearchScreen);
