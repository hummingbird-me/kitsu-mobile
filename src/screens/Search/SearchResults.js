import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon, Button } from 'native-base';
import AweIcon from 'react-native-vector-icons/FontAwesome';

import { search } from '../../store/anime/actions';
import { ResultsList } from './Lists';

class SearchResults extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.label,
    headerLeft: (
      <Button transparent color="white" onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" style={{ color: 'white' }} />
      </Button>
    ),
    headerRight: (
      <Button
        transparent
        color="white"
        onPress={() =>
          navigation.navigate('SearchFilter', {
            ...navigation.state.params,
            onApply: (data, state) => {
              navigation.goBack(null);
              setTimeout(
                () => navigation.setParams({ filter: data.filter, sort: data.sort, default: null, label: 'Search', data: state, fade: data.fade }),
                10,
              );
            },
          })}
      >
        <AweIcon name="sliders" style={{ color: 'white', fontSize: 16 }} />
      </Button>
    ),
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-search" android="md-search" style={{ fontSize: 24, color: tintColor }} />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      index: 0,
    };
    this.loadMore = this.loadMore.bind(this);
    this.refresh = this.refresh.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.results !== this.props.results) {
      this.setState({ loading: false });
    }
    if (this.props.navigation.state.params !== nextProps.navigation.state.params) {
      this.getData(0, nextProps.navigation.state);
    }
  }

  getData(index = 0, newParams) {
    const { params } = newParams || this.props.navigation.state;
    this.props.search(params.filter, params.sort, index, params.default, params.active);
  }

  refresh() {
    this.setState({ loading: true, index: 0 });
    this.getData();
  }

  loadMore() {
    if (!this.props.loading) {
      const index = this.state.index + 1;
      this.getData(index);
      this.setState({ index });
    }
  }

  render() {
    const data = this.props.results.length > 0
      ? this.props.results
      : Array(20).fill(1).map((item, index) => ({ key: index }));
    return (
      <ResultsList
        dataArray={data}
        loadMore={this.loadMore}
        refresh={this.refresh}
        refreshing={this.state.refresh}
      />
    );
  }
}

SearchResults.propTypes = {
  results: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  search: PropTypes.func.isRequired,
};

const mapStateToProps = ({ anime }, ownProps) => {
  const { resultsLoading } = anime;
  const { navigation: { state: { params: { active } } } } = ownProps;
  const data = anime[`results${active}`].map(item => ({
    image: item.posterImage ? item.posterImage.small : 'none',
    titles: item.titles ? item.titles : {},
    key: item.id,
  }));
  return { results: data, loading: resultsLoading };
};
export default connect(mapStateToProps, { search })(SearchResults);
