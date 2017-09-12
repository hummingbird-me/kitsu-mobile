import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ViewPropTypes } from 'react-native';
import debounce from 'lodash/debounce';
import { SearchBox } from 'kitsu/components/SearchBox';
import { styles } from './styles';

const MINIMUM_SEARCH_TERM_LENGTH = 3;
const USER_LIBRARY_SEARCH_SCREEN_ROUTE = 'UserLibrarySearch';

export class UserLibrarySearchBoxComponent extends React.Component {
  static propTypes = {
    fetchUserLibrary: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    style: ViewPropTypes.style,
    userLibrarySearch: PropTypes.object.isRequired,
    updateLibrarySearchTerm: PropTypes.func.isRequired,
  }

  static defaultProps = {
    style: null,
  }

  state = {
    canSearch: false,
    isNewSearch: false,
  }

  componentWillReceiveProps(nextProps) {
    const { routeName } = this.props.navigation.state;
    const currentSearchTerm = this.props.userLibrarySearch.searchTerm;
    const nextSearchTerm = nextProps.userLibrarySearch.searchTerm;
    const isNewSearchTerm = currentSearchTerm !== nextSearchTerm;
    const canSearch = nextSearchTerm.length >= MINIMUM_SEARCH_TERM_LENGTH;
    const isNewProfile = this.props.profile.id !== nextProps.profile.id;
    const isSearchScreen = routeName !== USER_LIBRARY_SEARCH_SCREEN_ROUTE;
    const isNewSearch = isNewSearchTerm || isNewProfile;

    if (canSearch && (isNewSearch || !isSearchScreen)) {
      this.setState({ isNewSearch, canSearch: true });
    } else if (nextSearchTerm.length === 0) {
      this.debouncedFetch();
    } else {
      this.setState({ canSearch: false });
    }
  }

  debouncedSearch = debounce(() => {
    const { routeName } = this.props.navigation.state;
    const { profile, userLibrarySearch } = this.props;

    if (this.state.isNewSearch) {
      this.props.fetchUserLibrary({
        searchTerm: userLibrarySearch.searchTerm,
        userId: profile.id,
      });

      this.setState({ isNewSearch: false });
    }

    if (routeName !== USER_LIBRARY_SEARCH_SCREEN_ROUTE) {
      this.props.navigation.navigate(USER_LIBRARY_SEARCH_SCREEN_ROUTE, {
        profile,
      });
    }
  }, 500);

  debouncedFetch = debounce(() => {
    const { routeName } = this.props.navigation.state;
    const { profile } = this.props;

    if (routeName === USER_LIBRARY_SEARCH_SCREEN_ROUTE) {
      this.props.fetchUserLibrary({ userId: profile.id });
      this.props.navigation.goBack();
    }
  }, 500);

  searchLibrary = () => {
    const { routeName } = this.props.navigation.state;

    if (this.state.canSearch || routeName !== USER_LIBRARY_SEARCH_SCREEN_ROUTE) {
      this.debouncedSearch();
    }
  }

  render() {
    return (
      <SearchBox
        style={[styles.searchBox, this.props.style]}
        onChangeText={this.props.updateLibrarySearchTerm}
        placeholder="Search Library"
        searchIconOffset={120}
        value={this.props.userLibrarySearch.searchTerm}
        onBlur={this.searchLibrary}
        onSubmitEditing={this.searchLibrary}
      />
    );
  }
}
