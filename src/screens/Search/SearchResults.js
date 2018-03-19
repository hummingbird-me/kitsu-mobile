import React, { Component } from 'react';
import { StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { search } from 'kitsu/store/anime/actions';
import * as colors from 'kitsu/constants/colors';
import { NavigationHeader } from 'kitsu/components/NavigationHeader';
import { ResultsList } from './Lists';

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.darkPurple,
  },
});

class SearchResults extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    header: () => (
      <NavigationHeader
        navigation={navigation}
        title={navigation.state.params.label}
        leftAction={() => {
          navigation.goBack(navigation.state.params.previousRoute || null);
        }}
        rightIcon="sliders"
        rightAction={() => (
          screenProps.rootNavigation.navigate('SearchFilter', {
            ...navigation.state.params,
            onApply: (data, state) => {
              screenProps.rootNavigation.goBack(null);
              setTimeout(() =>
                navigation.setParams({
                  filter: data.filter,
                  sort: data.sort,
                  default: null,
                  label: 'Search',
                  data: state,
                  fade: data.fade,
                }),
              );
            },
          })
        )}
      />
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
    // const { params } = this.props.navigation.state;
    const { results, loading, currentUser } = this.props;
    const data =
      !loading || results.length > 0
        ? this.props.results
        : Array(20)
          .fill(1)
          .map((item, index) => ({ key: index }));
    return (
      <ResultsList
        hits={data}
        onEndReached={this.loadMore}
        onRefresh={this.refresh}
        refreshing={this.state.loading}
        onPress={(media) => {
          if (media) {
            this.props.navigation.navigate('MediaPages', {
              mediaId: media.id,
              mediaType: media.type,
            });
          }
        }}
        style={styles.list}
        currentUser={currentUser}
      />
    );
  }
}

SearchResults.propTypes = {
  results: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  search: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

SearchResults.defaultProps = {
  currentUser: null,
};

const mapStateToProps = ({ anime, user }, ownProps) => {
  const { resultsLoading } = anime;
  const { currentUser } = user;
  const { navigation: { state: { params: { active } } } } = ownProps;
  const data = anime[`results${active}`].map(item => ({
    image: item.posterImage ? item.posterImage.small : 'none',
    titles: item.titles ? item.titles : {},
    canonicalTitle: item.canonicalTitle,
    key: item.id,
    type: item.type,
    id: item.id,
  }));
  return { currentUser, results: data, loading: resultsLoading };
};
export default connect(mapStateToProps, { search })(SearchResults);
