import React, { Component } from 'react';
import { StyleSheet, RefreshControl, ActivityIndicator, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { search } from 'app/store/anime/actions';
import * as colors from 'app/constants/colors';
import { NavigationHeader } from 'app/components/NavigationHeader';
import { getMaxVisibleRows, getCurrentVisibleRows } from 'app/screens/Search/Lists/ResultsList/spacing';
import { isEqual } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'app/navigation';
import { ResultsList } from './Lists';

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      index: 0,
      label: props.label,
      filter: props.filter,
      sort: props.sort,
      defaultSearch: props.default,
      fade: false,
      filterData: this.getFilterDataFromFilter(props.filter),
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.results !== this.props.results) {
      this.setState({ refreshing: false });
    }
  }

  getFilterDataFromFilter(filter) {
    const data = {};
    if (filter && filter.categories) {
      data.categories = filter.categories.split(',');
    }
    return data;
  }

  getData = (index = 0) => {
    if (index === 0) {
      this.setState({ refreshing: true });
    }

    const { active } = this.props;
    const { filter, sort, defaultSearch } = this.state;
    this.props.search(filter, sort, index, defaultSearch, active, () => {
      this.setState({ refreshing: false });
      if (this.shouldLoadMore) {
        this.loadMore();
      }
    });
  };

  shouldLoadMore = false;

  refresh = () => {
    this.setState({ refreshing: true, index: 0 });
    this.getData();
  };

  loadMore = () => {
    if (!this.props.loading) {
      this.shouldLoadMore = false;
      const index = this.state.index + 1;
      this.getData(index);
      this.setState({ index });
    } else {
      this.shouldLoadMore = true;
    }
  };

  renderFooter = () => {
    const { loading } = this.props;
    const { refreshing } = this.state;

    if (!loading || refreshing) return null;

    return (
      <ActivityIndicator color="white" style={{ paddingVertical: 16 }} />
    );
  }

  renderNavigationHeader = () => {
    const { componentId } = this.props;
    const { label, filterData } = this.state;
    return (
      <NavigationHeader
        componentId={componentId}
        title={label}
        rightIcon="sliders"
        rightAction={() => (
          Navigation.push(componentId, {
            component: {
              name: Screens.SEARCH_FILTER,
              passProps: {
                data: filterData,
                onApply: (data, state) => {
                  Navigation.popTo(componentId);
                  this.setState({
                    filter: data.filter,
                    sort: data.sort,
                    defaultSearch: null,
                    label: 'Search',
                    filterData: state,
                    fade: data.fade,
                  }, () => {
                    this.getData();
                  });
                },
              },
            },
          })
        )}
      />
    );
  }

  render() {
    const { results, loading, currentUser } = this.props;
    const emptyArray = Array(20).fill(1).map((item, index) => ({ key: index }));
    const data = (!loading || results.length > 0) ? this.props.results : emptyArray;

    // Check if we have to load more entries
    // There's a bug with `onEndReached` where it will only get called once and if content does not fill all of the screen
    // then `onEndReached` will not be called again
    const maxRows = getMaxVisibleRows();
    const currentRows = getCurrentVisibleRows(data.length);

    // We load more if we still have rows that we can fill
    if (!loading && results.length > 0 && currentRows < maxRows) {
      this.loadMore();
    }

    return (
      <View style={{ flex: 1, backgroundColor: colors.darkPurple }}>
        {this.renderNavigationHeader()}
        <View style={{ flex: 1 }}>
          <ResultsList
            hits={data}
            onPress={(media) => {
              if (media) {
                Navigation.push(this.props.componentId, {
                  component: {
                    name: Screens.MEDIA_PAGE,
                    passProps: {
                      mediaId: media.id,
                      mediaType: media.type,
                    },
                  },
                });
              }
            }}
            style={{ backgroundColor: colors.darkPurple }}
            currentUser={currentUser}
            onEndReached={this.loadMore}
            refreshControl={
              <RefreshControl
                colors={['white']}
                tintColor={'white'}
                refreshing={this.state.refreshing}
                onRefresh={this.refresh}
              />
            }
            renderFooter={this.renderFooter}
          />
        </View>
      </View>
    );
  }
}

SearchResults.propTypes = {
  componentId: PropTypes.any.isRequired,
  results: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  search: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  label: PropTypes.string,
  default: PropTypes.any,
  active: PropTypes.oneOf(['anime', 'manga']).isRequired,
  filter: PropTypes.any,
  sort: PropTypes.string,
};

SearchResults.defaultProps = {
  label: 'Results',
  default: '',
  filter: {},
  sort: '',
  currentUser: null,
};

const mapStateToProps = ({ anime, user }, ownProps) => {
  const { resultsLoading } = anime;
  const { currentUser } = user;
  const { active } = ownProps;
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
