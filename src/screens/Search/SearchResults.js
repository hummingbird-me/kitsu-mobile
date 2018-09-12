import React, { Component } from 'react';
import { StyleSheet, RefreshControl, ActivityIndicator, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { search } from 'kitsu/store/anime/actions';
import * as colors from 'kitsu/constants/colors';
import { NavigationHeader } from 'kitsu/components/NavigationHeader';
import { getMaxVisibleRows, getCurrentVisibleRows } from 'kitsu/screens/Search/Lists/ResultsList/spacing';
import { isEqual } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'kitsu/navigation';
import { ResultsList } from './Lists';
import { bottomTabsHeight } from 'kitsu/constants/app';

class SearchResults extends Component {
  state = {
    refreshing: false,
    index: 0,
  };

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.results !== this.props.results) {
      this.setState({ refreshing: false });
    }

    // if (!isEqual(this.props, nextProps)) {
    //   this.getData(0, nextProps);
    // }
  }

  getData = (index = 0, newParams) => {
    if (index === 0) {
      this.setState({ refreshing: true });
    }

    const params = newParams || this.props;
    this.props.search(params.filter, params.sort, index, params.default, params.active, () => {
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
    // TODO: Fix this up
    const { componentId, label } = this.props;
    return (
      <NavigationHeader
        componentId={componentId}
        title={label}
        rightIcon="sliders"
        // rightAction={() => (
        //   screenProps.rootNavigation.navigate('SearchFilter', {
        //     ...navigation.state.params,
        //     onApply: (data, state) => {
        //       screenProps.rootNavigation.goBack(null);
        //       setTimeout(() =>
        //         navigation.setParams({
        //           filter: data.filter,
        //           sort: data.sort,
        //           default: null,
        //           label: 'Search',
        //           data: state,
        //           fade: data.fade,
        //         }),
        //       );
        //     },
        //   })
        // )}
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
    // TODO: Fix load more not working properly
    if (!loading && results.length > 0 && currentRows < maxRows) {
      this.loadMore();
    }

    return (
      <View stlye={{ flex: 1, backgroundColor: colors.darkPurple }}>
        {this.renderNavigationHeader()}
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
          style={{ backgroundColor: colors.darkPurple, marginBottom: bottomTabsHeight }}
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
    );
  }
}

SearchResults.propTypes = {
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
