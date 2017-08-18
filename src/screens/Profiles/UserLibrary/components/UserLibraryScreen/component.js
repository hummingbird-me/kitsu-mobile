import * as React from 'react';
import { Container, Icon } from 'native-base';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ProfileHeader } from 'kitsu/components/ProfileHeader';
import { LibraryHeader } from 'kitsu/screens/Profiles/UserLibrary';
import { styles } from './styles';

export class UserLibraryScreenComponent extends React.Component {
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
          title={profile.name}
          onClickBack={props.navigation.goBack}
        />
      ),
      tabBarIcon: ({ tintColor }) => (
        <Icon ios="ios-body" android="md-body" style={{ fontSize: 24, color: tintColor }} />
      ),
    };
  };

  constructor() {
    super();
    this.renderItem = this.renderItem.bind(this);
    this.renderLists = this.renderLists.bind(this);
  }

  componentDidMount() {
    const { profile } = this.props.navigation.state.params;
    this.props.fetchUserLibrary(profile.id);
  }

  renderItem({ item }) {
    const data = item.anime || item.manga;

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Media', {
            mediaId: data.id,
            type: data.type,
          });
        }}
      >
        <Image
          source={{ uri: data.posterImage.tiny }}
          style={styles.posterImageCard}
        />
      </TouchableOpacity>
    );
  }

  renderLists(type) {
    const { userLibrary } = this.props;
    const listOrder = [
      { status: 'current', anime: 'Watching', manga: 'Reading' },
      { status: 'planned', anime: 'Want To Watch', manga: 'Want To Read' },
      { status: 'completed', anime: 'Completed', manga: 'Completed' },
      { status: 'onHold', anime: 'On Hold', manga: 'On Hold' },
      { status: 'dropped', anime: 'Dropped', manga: 'Dropped' },
    ];

    return listOrder.map(currentList => (
      <View key={`${currentList.status}-${type}`} >
        <LibraryHeader
          data={userLibrary[type][currentList.status]}
          status={currentList.status}
          type={type}
          title={currentList[type]}
        />
        <FlatList
          horizontal
          data={userLibrary[type][currentList.status]}
          renderItem={this.renderItem}
        />
      </View>
    ));
  }

  render() {
    const { userLibrary } = this.props;

    if (userLibrary.loading) {
      return (
        <Container style={styles.container}>
          <Text>Loading...</Text>
        </Container>
      );
    }

    return (
      <Container style={styles.container}>
        <ScrollableTabView>
          <ScrollView key="Anime" tabLabel="Anime" id="anime">
            {this.renderLists('anime')}
          </ScrollView>
          <ScrollView key="Manga" tabLabel="Manga" id="manga">
            {this.renderLists('manga')}
          </ScrollView>
        </ScrollableTabView>
      </Container>
    );
  }
}

UserLibraryScreenComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  fetchUserLibrary: PropTypes.func.isRequired,
  userLibrary: PropTypes.object,
};

UserLibraryScreenComponent.defaultProps = {
  userLibrary: {
    loading: true,
  },
};
