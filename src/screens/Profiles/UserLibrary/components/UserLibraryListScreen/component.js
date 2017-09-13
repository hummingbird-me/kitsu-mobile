import * as React from 'react';
import { FlatList, View } from 'react-native';
import { PropTypes } from 'prop-types';
import debounce from 'lodash/debounce';
import { ProfileHeader } from 'kitsu/components/ProfileHeader';
import { UserLibraryListCard, UserLibrarySearchBox } from 'kitsu/screens/Profiles/UserLibrary';
import { idExtractor } from 'kitsu/common/utils';
import { styles } from './styles';

const HEADER_TEXT_MAPPING = {
  current: { anime: 'Watching', manga: 'Reading' },
  planned: { anime: 'Want To Watch', manga: 'Want to Read' },
  completed: { anime: 'Complete', manga: 'Complete' },
  onHold: { anime: 'On Hold', manga: 'On Hold' },
  dropped: { anime: 'Dropped', manga: 'Dropped' },
};

export class UserLibraryListScreenComponent extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    fetchUserLibraryByType: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    libraryEntries: PropTypes.object.isRequired,
    libraryStatus: PropTypes.string.isRequired,
    libraryType: PropTypes.string.isRequired,
    updateUserLibraryEntry: PropTypes.func.isRequired,
  };

  static navigationOptions = (props) => {
    const { libraryStatus, libraryType, profile } = props.navigation.state.params;

    return {
      headerStyle: {
        shadowColor: 'transparent',
        elevation: 0,
      },
      header: () => (
        <ProfileHeader
          profile={profile}
          title={HEADER_TEXT_MAPPING[libraryStatus][libraryType]}
          onClickBack={props.navigation.goBack}
        />
      ),
    };
  };

  state = {
    isSwiping: false,
  }

  onSwipingItem = (isSwiping) => {
    this.setState({ isSwiping });
  }

  debouncedFetch = debounce(() => {
    const { profile } = this.props.navigation.state.params;
    this.props.fetchUserLibraryByType({
      userId: profile.id,
      library: this.props.libraryType,
      status: this.props.libraryStatus,
    });
  }, 100);

  renderSearchBar = () => {
    const { profile } = this.props.navigation.state.params;

    return (
      <UserLibrarySearchBox
        navigation={this.props.navigation}
        profile={profile}
        style={styles.searchBox}
      />
    );
  }

  renderItem = ({ item }) => (
    <UserLibraryListCard
      currentUser={this.props.currentUser}
      data={item}
      libraryStatus={this.props.libraryStatus}
      libraryType={this.props.libraryType}
      navigate={this.props.navigation.navigate}
      profile={this.props.navigation.state.params.profile}
      updateUserLibraryEntry={this.props.updateUserLibraryEntry}
      onSwipingItem={this.onSwipingItem}
    />
  );

  render() {
    const { libraryEntries } = this.props;

    return (
      <View style={styles.container}>
        <View>
          <FlatList
            ListHeaderComponent={this.renderSearchBar}
            data={libraryEntries.data}
            initialNumToRender={10}
            initialScrollIndex={0}
            keyExtractor={idExtractor}
            onEndReached={libraryEntries.fetchMore}
            onEndReachedThreshold={0.75}
            removeClippedSubviews={false}
            renderItem={this.renderItem}
            scrollEnabled={!this.state.isSwiping}
          />
        </View>
      </View>
    );
  }
}
