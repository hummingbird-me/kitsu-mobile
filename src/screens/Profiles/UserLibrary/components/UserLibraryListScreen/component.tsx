import React, { PureComponent } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import { ProfileHeader } from 'kitsu/components/ProfileHeader';
import { StyledText } from 'kitsu/components/StyledText';
import { Screens } from 'kitsu/navigation';
import { UserLibraryList } from 'kitsu/screens/Profiles/UserLibrary/components/UserLibraryList';

import { styles } from './styles';

const HEADER_TEXT_MAPPING = {
  current: { anime: 'Watching', manga: 'Reading' },
  planned: { anime: 'Want To Watch', manga: 'Want to Read' },
  completed: { anime: 'Complete', manga: 'Complete' },
  on_hold: { anime: 'On Hold', manga: 'On Hold' },
  dropped: { anime: 'Dropped', manga: 'Dropped' },
};

interface UserLibraryListScreenComponentProps {
  currentUser: object;
  profile: object;
  componentId: any;
  libraryEntries: object;
  libraryStatus: string;
  libraryType: string;
  updateUserLibraryEntry(...args: unknown[]): unknown;
  deleteUserLibraryEntry(...args: unknown[]): unknown;
  loading?: boolean;
  refreshing?: boolean;
}

export class UserLibraryListScreenComponent extends PureComponent<UserLibraryListScreenComponentProps> {
  static defaultProps = {
    loading: false,
    refreshing: false,
  };

  onEntryUpdate = async (type, status, updates) => {
    try {
      await this.props.updateUserLibraryEntry(type, status, updates);
    } catch (e) {
      console.warn(e);
    }
  };

  onEntryDelete = async (id, type, status) => {
    if (!id) return;
    try {
      await this.props.deleteUserLibraryEntry(id, type, status);
    } catch (e) {
      console.warn(e);
    }
  };

  onRefresh = () => {
    const { refreshing, libraryEntries } = this.props;
    if (!refreshing && libraryEntries && libraryEntries.refresh) {
      libraryEntries.refresh();
    }
  };

  onEndReached = () => {
    const { loading, libraryEntries } = this.props;
    if (!loading && libraryEntries && libraryEntries.fetchMore) {
      libraryEntries.fetchMore();
    }
  };

  navigateToSearch = () => {
    const { profile, componentId } = this.props;

    if (profile) {
      Navigation.push(componentId, {
        component: {
          name: Screens.LIBRARY_SEARCH,
          passProps: {
            profile,
          },
        },
      });
    }
  };

  renderSearchBar = () => (
    <TouchableOpacity style={styles.searchBox} onPress={this.navigateToSearch}>
      <Icon name="search" style={styles.searchIcon} />
      <StyledText color="dark" textStyle={styles.searchText}>
        Search Library
      </StyledText>
    </TouchableOpacity>
  );

  render() {
    const {
      currentUser,
      profile,
      componentId,
      libraryEntries,
      libraryStatus,
      libraryType,
      loading,
      refreshing,
    } = this.props;

    return (
      <View style={styles.container}>
        <ProfileHeader
          profile={profile}
          title={HEADER_TEXT_MAPPING[libraryStatus][libraryType]}
          onClickBack={() => Navigation.pop(componentId)}
        />
        {this.renderSearchBar()}
        <UserLibraryList
          componentId={componentId}
          currentUser={currentUser}
          profile={profile}
          libraryEntries={(libraryEntries && libraryEntries.data) || []}
          libraryStatus={libraryStatus}
          libraryType={libraryType}
          loading={loading}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          onLibraryEntryUpdate={this.onEntryUpdate}
          onLibraryEntryDelete={this.onEntryDelete}
        />
      </View>
    );
  }
}
