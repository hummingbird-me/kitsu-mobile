import React, { PureComponent } from 'react';
import { View, FlatList, ScrollView, Keyboard, ActivityIndicator, Text, Image } from 'react-native';
import { PropTypes } from 'prop-types';
import { capitalize, isEmpty } from 'lodash';
import { UserLibraryListCard } from 'kitsu/screens/Profiles/UserLibrary';
import { SearchBox } from 'kitsu/components/SearchBox';
import { Kitsu } from 'kitsu/config/api';
import { ProfileHeader } from 'kitsu/components/ProfileHeader';
import { KitsuLibrary, KitsuLibraryEvents } from 'kitsu/utils/kitsuLibrary';
import unstarted from 'kitsu/assets/img/quick_update/unstarted.png';
import { styles } from './styles';

const HEADER_MAPPING = {
  anime: {
    current: 'Watching',
    planned: 'Want to Watch',
    completed: 'Completed',
    on_hold: 'On Hold',
    dropped: 'Dropped',
  },
  manga: {
    current: 'Reading',
    planned: 'Want to Read',
    completed: 'Completed',
    on_hold: 'On Hold',
    dropped: 'Dropped',
  },
};

export class LibrarySearchComponent extends PureComponent {
  static navigationOptions = () => ({
    header: null,
  });

  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    updateUserLibraryEntry: PropTypes.func.isRequired,
    deleteUserLibraryEntry: PropTypes.func.isRequired,
  };

  state = {
    loadingAnime: false,
    loadingManga: false,
    anime: [],
    manga: [],
    isSwiping: false,
    searchTerm: '',
  }

  componentDidMount() {
    this.unsubscribeUpdate = KitsuLibrary.subscribe(KitsuLibraryEvents.LIBRARY_ENTRY_UPDATE, this.kitsuLibraryEntryUpdated);
    this.unsubscribeDelete = KitsuLibrary.subscribe(KitsuLibraryEvents.LIBRARY_ENTRY_DELETE, this.kitsuLibraryEntryDeleted);
  }

  componentWillUnmount() {
    this.unsubscribeUpdate();
    this.unsubscribeDelete();
  }

  onEntryUpdate = async (type, status, updates) => {
    try {
      await this.props.updateUserLibraryEntry(type, status, updates);
    } catch (e) {
      console.warn(e);
    }
  }

  onEntryDelete = async (id, type, status) => {
    if (!id) return;
    try {
      await this.props.deleteUserLibraryEntry(id, type, status);
    } catch (e) {
      console.warn(e);
    }
  }

  onSwipingItem = (isSwiping) => {
    this.setState({ isSwiping });
  }

  onSearchTermChanged = (newTerm) => {
    this.setState({ searchTerm: newTerm }, () => {
      this.searchLibrary();
    });
  }

  kitsuLibraryEntryUpdated = ({ type, newEntry }) => {
    // If entry was updated then update our local copies
    if (!type || !newEntry) return;

    const newEntries = this.state[type].map((oldEntry) => {
      if (oldEntry.id !== newEntry.id) {
        return oldEntry;
      }
      return newEntry;
    });
    this.setState({ [type]: newEntries });
  }

  kitsuLibraryEntryDeleted = ({ id }) => {
    let { anime, manga } = this.state;

    if (!id) return;
    anime = anime.filter(e => e.id != id);
    manga = manga.filter(e => e.id != id);
    this.setState({ anime, manga });
  }

  searchLibrary = async () => {
    const { profile } = this.props;
    const { searchTerm } = this.state;

    if (!profile) return;

    this.searchLibraryByType('anime', searchTerm);
    this.searchLibraryByType('manga', searchTerm);
  }

  searchLibraryByType = async (type, searchTerm) => {
    const { profile } = this.props;
    const loadingStateKey = type === 'anime' ? 'loadingAnime' : 'loadingManga';

    if (!profile) return;

    // Reset state if search is empty
    if (isEmpty(searchTerm)) {
      this.setState({
        [type]: [],
        [loadingStateKey]: false,
      });
      return;
    }

    this.setState({ [loadingStateKey]: true });

    // Fetch the entries
    try {
      const results = await Kitsu.findAll('libraryEntries', {
        fields: {
          anime: 'canonicalTitle,posterImage,episodeCount',
          manga: 'canonicalTitle,posterImage,chapterCount',
        },
        filter: {
          userId: profile.id,
          kind: type,
          title: searchTerm,
        },
        include: 'anime,manga',
        page: {
          limit: 20,
        },
      });

      // Only update if search terms match
      // This also prevents race conditions
      if (this.state.searchTerm.trim() === searchTerm.trim()) {
        this.setState({ [type]: results, [loadingStateKey]: false });
      }
    } catch (e) {
      this.setState({ [loadingStateKey]: false });
      console.log(e);
    }
  }

  goBack = () => this.props.navigation.goBack();

  renderSearchBox() {
    return (
      <SearchBox
        style={styles.searchBox}
        onChangeText={this.onSearchTermChanged}
        placeholder="Search Library"
        searchIconOffset={120}
        value={this.state.searchTerm}
        onSubmitEditing={Keyboard.dismiss}
      />
    );
  }

  renderListHeader = title => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>{title}</Text>
    </View>
  );

  renderItem = ({ item }) => {
    const { currentUser, navigation, profile } = this.props;
    const media = item && (item.anime || item.manga);
    if (!media) return null;

    return (
      <UserLibraryListCard
        currentUser={currentUser}
        libraryEntry={item}
        libraryStatus={item.status}
        libraryType={media.type}
        navigate={navigation.navigate}
        profile={profile}
        updateUserLibraryEntry={this.onEntryUpdate}
        deleteUserLibraryEntry={this.onEntryDelete}
        onSwipingItem={this.onSwipingItem}
      />
    );
  }

  renderList(type) {
    const { loadingAnime, loadingManga } = this.state;

    const isLoading = type === 'anime' ? loadingAnime : loadingManga;

    // If we're loading then show the indicator
    if (isLoading) {
      return (
        <View>
          {this.renderListHeader(capitalize(type))}
          <View style={styles.loading}>
            <ActivityIndicator color="white" />
          </View>
        </View>
      );
    }

    const statuses = Object.keys(HEADER_MAPPING[type]);

    return (
      <View>
        { statuses && statuses.map(status => this.renderSubList(type, status)) }
      </View>
    );
  }

  renderSubList(type, status) {
    const { isSwiping } = this.state;

    // Filter the entries
    const data = this.state[type];
    const filtered = data.filter(e => e.status === status);

    // Don't bother showing the list if data is empty
    if (filtered.length === 0) return null;

    // Setup header titles
    const count = (filtered && `(${filtered.length})`) || '';
    const statusTitle = (HEADER_MAPPING[type] && HEADER_MAPPING[type][status]) || 'Unknown';
    const title = `${capitalize(type)} - ${statusTitle} ${count}`;

    return (
      <FlatList
        key={`${type}-${status}`}
        data={filtered}
        renderItem={this.renderItem}
        scrollEnabled={!isSwiping}
        ListHeaderComponent={this.renderListHeader(title)}
      />
    );
  }

  renderContent() {
    return (
      <View>
        {this.renderList('anime')}
        {this.renderList('manga')}
      </View>
    );
  }

  renderEmptyContent() {
    const { searchTerm } = this.state;
    const { profile } = this.props;

    const name = profile && capitalize(profile.name);

    const emptyTermTitle = isEmpty(name) ? 'Search for Media' : `Search ${name}'s Library`;
    const title = isEmpty(searchTerm) ? emptyTermTitle : 'We couldn\'t find any results';
    const subText = isEmpty(searchTerm) ? 'Type in a media title to start searching!' : 'Please try search for a different term.';

    return (
      <View style={styles.emptyStateContainer}>
        <View style={styles.statusWrapper}>
          <Text style={styles.statusTitle}>{title}</Text>
          <Text style={styles.statusText}>{subText}</Text>
          <Image style={styles.statusImage} source={unstarted} />
        </View>
      </View>
    );
  }

  render() {
    const { anime, manga, loadingAnime, loadingManga } = this.state;
    const { profile } = this.props;

    const dataEmpty = isEmpty(anime) && isEmpty(manga);
    const dataLoading = loadingAnime || loadingManga;

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <ProfileHeader
            profile={profile}
            title="Library Search"
            onClickBack={this.goBack}
            hasOverlay
          />
        </View>
        {this.renderSearchBox()}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {!dataLoading && dataEmpty && this.renderEmptyContent()}
          {(dataLoading || !dataEmpty) && this.renderContent()}
        </ScrollView>
      </View>
    );
  }
}
