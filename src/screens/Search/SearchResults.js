import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { search } from 'kitsu/store/anime/actions';
import { ResultsList } from './Lists';
import * as colors from 'kitsu/constants/colors';

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
  list: {
    backgroundColor: colors.darkPurple,
    paddingHorizontal: 4,
  },
});

class SearchResults extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.state.params.label,
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
        <FontAwesomeIcon name="chevron-left" style={{ color: 'white' }} />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          screenProps.rootNavigation.navigate('SearchFilter', {
            ...navigation.state.params,
            onApply: (data, state) => {
              navigation.goBack(null);
              setTimeout(
                () =>
                  navigation.setParams({
                    filter: data.filter,
                    sort: data.sort,
                    default: null,
                    label: 'Search',
                    data: state,
                    fade: data.fade,
                  }),
                10,
              );
            },
          });
        }}
      >
        <FontAwesomeIcon name="sliders" style={{ color: 'white', fontSize: 16 }} />
      </TouchableOpacity>
    ),
  });

  state = {
    loading: false,
    index: 0,
  };

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

  getData = (index = 0, newParams) => {
    const { params } = newParams || this.props.navigation.state;
    this.props.search(params.filter, params.sort, index, params.default, params.active);
  };

  refresh = () => {
    this.setState({ loading: true, index: 0 });
    this.getData();
  };

  loadMore = () => {
    if (!this.props.loading) {
      const index = this.state.index + 1;
      this.getData(index);
      this.setState({ index });
    }
  };

  render() {
    const data =
      this.props.results.length > 0
        ? this.props.results
        : Array(20)
          .fill(1)
          .map((item, index) => ({ key: index }));
    return (
      <ResultsList
        hits={data}
        numColumns={3}
        onEndReached={this.loadMore}
        onRefresh={this.refresh}
        refreshing={this.state.loading}
        onPress={(media) => {
          this.props.navigation.navigate('Media', {
            mediaId: media.id,
            type: media.type,
          });
        }}
        style={styles.list}
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
    type: item.type,
    id: item.id,
  }));
  return { results: data, loading: resultsLoading };
};
export default connect(mapStateToProps, { search })(SearchResults);
