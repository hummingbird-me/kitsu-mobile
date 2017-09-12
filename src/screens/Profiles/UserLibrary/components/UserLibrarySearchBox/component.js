import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ViewPropTypes } from 'react-native';
import debounce from 'lodash/debounce';
import { SearchBox } from 'kitsu/components/SearchBox';
import { styles } from './styles';

const MINIMUM_SEARCH_TERM_LENGTH = 3;

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
  }

  componentWillReceiveProps(nextProps) {
    const currentSearchTerm = this.props.userLibrarySearch.searchTerm;
    const nextSearchTerm = nextProps.userLibrarySearch.searchTerm;
    const isNewSearchTerm = currentSearchTerm !== nextSearchTerm;
    const canSearch = nextSearchTerm.length >= MINIMUM_SEARCH_TERM_LENGTH;
    const isNewProfile = this.props.profile.id !== nextProps.profile.id;

    if (canSearch && (isNewSearchTerm || isNewProfile)) {
      this.setState({ canSearch: true });
    } else if (nextSearchTerm.length === 0) {
      this.debouncedFetch();
    } else {
      this.setState({ canSearch: false });
    }
  }

  debouncedSearch = debounce(() => {
    const { routeName } = this.props.navigation.state;
    const { profile, userLibrarySearch } = this.props;

    this.props.fetchUserLibrary({
      searchTerm: userLibrarySearch.searchTerm,
      userId: profile.id,
    });

    if (routeName !== 'UserLibrarySearch') {
      this.props.navigation.navigate('UserLibrarySearch', {
        profile,
      });
    }
  }, 500);

  debouncedFetch = debounce(() => {
    const { routeName } = this.props.navigation.state;
    const { profile } = this.props;

    if (routeName === 'UserLibrarySearch') {
      this.props.fetchUserLibrary({ userId: profile.id });
      this.props.navigation.goBack();
    }
  }, 500);

  searchLibrary = () => {
    if (this.state.canSearch) {
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
