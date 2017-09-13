import * as React from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { PropTypes } from 'prop-types';
import { ProfileHeader } from 'kitsu/components/ProfileHeader';
import { UserLibraryListCard, UserLibrarySearchBox } from 'kitsu/screens/Profiles/UserLibrary';
import { idExtractor } from 'kitsu/common/utils';
import { styles } from './styles';

const renderListHeader = title => (
  <View style={styles.listHeader}>
    <Text style={styles.listHeaderText}>{title}</Text>
  </View>
);

export class UserLibrarySearchScreenComponent extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    userLibrarySearch: PropTypes.object.isRequired,
    updateUserLibrarySearchEntry: PropTypes.func.isRequired,
  };

  static navigationOptions = (props) => {
    const { profile } = props.navigation.state.params;

    return {
      headerStyle: {
        shadowColor: 'transparent',
        elevation: 0,
      },
      header: () => (
        <ProfileHeader
          profile={profile}
          title="Library Search"
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

  renderItem = ({ item }) => {
    const media = item.anime || item.manga;
    return (
      <UserLibraryListCard
        currentUser={this.props.currentUser}
        data={item}
        libraryStatus={item.status}
        libraryType={media.type}
        navigate={this.props.navigation.navigate}
        onSwipingItem={this.onSwipingItem}
        profile={this.props.navigation.state.params.profile}
        updateUserLibraryEntry={this.props.updateUserLibrarySearchEntry}
      />
    );
  };

  renderLists = (type) => {
    const { userLibrarySearch } = this.props;
    const listOrder = [
      { status: 'current', anime: 'Watching', manga: 'Reading' },
      { status: 'planned', anime: 'Want To Watch', manga: 'Want To Read' },
      { status: 'completed', anime: 'Completed', manga: 'Completed' },
      { status: 'onHold', anime: 'On Hold', manga: 'On Hold' },
      { status: 'dropped', anime: 'Dropped', manga: 'Dropped' },
    ];

    return listOrder.map((currentList) => {
      const { status } = currentList;
      const { data, fetchMore } = userLibrarySearch[type][status];

      return data.length ? (
        <View key={`${status}-${type}`}>
          <FlatList
            data={data}
            initialScrollIndex={0}
            keyExtractor={idExtractor}
            ListHeaderComponent={renderListHeader(currentList[type])}
            onEndReached={fetchMore}
            onEndReachedThreshold={0.5}
            removeClippedSubviews={false}
            renderItem={this.renderItem}
            scrollEnabled={!this.state.isSwiping}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ) : null;
    });
  }

  render() {
    const { profile } = this.props.navigation.state.params;

    return (
      <View style={styles.container}>
        <UserLibrarySearchBox
          navigation={this.props.navigation}
          profile={profile}
          style={styles.searchBoxStyle}
        />

        <ScrollView
          style={styles.listsContainer}
          scrollEnabled={!this.state.isSwiping}
        >
          {this.renderLists('anime')}
          {this.renderLists('manga')}
        </ScrollView>
      </View>
    );
  }
}
