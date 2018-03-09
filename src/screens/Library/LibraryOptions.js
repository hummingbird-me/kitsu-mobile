import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { updateUserLibraryEntry, deleteUserLibraryEntry, fetchUserLibrary, setLibrarySort } from 'kitsu/store/profile/actions';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { PropTypes } from 'prop-types';
import { UserLibraryList } from 'kitsu/screens/Profiles/UserLibrary/components/UserLibraryList';
import { capitalize, isEmpty } from 'lodash';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import { KitsuLibrarySort } from 'kitsu/utils/kitsuLibrary';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';

const sortOptions = [
  {
    key: KitsuLibrarySort.TITLE,
    value: 'Title',
  },
  {
    key: KitsuLibrarySort.LENGTH,
    value: 'Length',
  },
  {
    key: KitsuLibrarySort.DATE_UPDATED,
    value: 'Date Updated',
  },
  {
    key: KitsuLibrarySort.DATE_PROGRESSED,
    value: 'Date Progressed',
  },
  {
    key: KitsuLibrarySort.DATE_ADDED,
    value: 'Date Added',
  },
  {
    key: KitsuLibrarySort.DATE_STARTED,
    value: 'Date Started',
  },
  {
    key: KitsuLibrarySort.DATE_FINSIHED,
    value: 'Date Finished',
  },
];

class LibraryOptionsComponent extends PureComponent {
  static navigationOptions = () => ({
    header: null,
  });

  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    sort: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchUserLibrary: PropTypes.func.isRequired,
    setLibrarySort: PropTypes.func.isRequired,
  };

  state = {
    didChangeSort: false,
  }

  goBack = () => {
    const { fetchUserLibrary, navigation, currentUser } = this.props;
    const { didChangeSort } = this.state;

    // Update theuser library
    if (currentUser && didChangeSort) {
      fetchUserLibrary({ userId: currentUser.id, refresh: true });
    }

    navigation.goBack();
  };

  updateSort(sortBy, ascending) {
    const { setLibrarySort, sort, currentUser } = this.props;
    if (!currentUser) return;

    // Don't bother updating if nothing changed
    if (sort && sort.by === sortBy && sort.ascending === ascending) return;

    // Set the sort and update the library
    setLibrarySort(sortBy, ascending);
    this.setState({ didChangeSort: true });
  }

  renderSortOptions() {
    const { sort } = this.props;
    return sortOptions.map(option => (
      <TouchableOpacity
        onPress={() => this.updateSort(option.key, sort.ascending)}
        style={styles.libraryOption}
      >
        <View style={{ flex: 1 }}>
          <StyledText color="light" size="small" textStle={styles.libraryOptionText}>{option.value}</StyledText>
        </View>
        { sort && sort.by === option.key &&
          <Icon name="ios-checkmark" color="white" style={styles.optionSelectedIcon} />
        }
      </TouchableOpacity>
    ));
  }

  render() {
    return (
      <View style={styles.container}>
        <CustomHeader
          leftButtonAction={this.goBack}
          leftButtonTitle="Save"
        />
        <ScrollView style={{ flex: 1 }}>
          {this.renderSortOptions()}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ user, profile }) => {
  const { currentUser } = user;
  const { userLibrary } = profile;
  const sort = userLibrary && userLibrary.sort;

  return {
    currentUser,
    sort,
  };
};

export const LibraryOptions = connect(mapStateToProps, {
  fetchUserLibrary,
  setLibrarySort,
})(LibraryOptionsComponent);
