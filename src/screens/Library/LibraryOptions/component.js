import React, { PureComponent } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { PropTypes } from 'prop-types';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import { KitsuLibrarySort } from 'kitsu/utils/kitsuLibrary';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from 'kitsu/components/Button';
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
    key: KitsuLibrarySort.POPULARITY,
    value: 'Media Popularity',
  },
  {
    key: KitsuLibrarySort.AVERAGE_RATING,
    value: 'Media Rating',
  },
  {
    key: KitsuLibrarySort.RATING,
    value: 'Entry Rating',
  },
  {
    key: KitsuLibrarySort.PROGRESS,
    value: 'Entry Progress',
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

export class LibraryOptionsComponent extends PureComponent {
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
    sort: this.props.sort,
  }

  componentWillReceiveProps(nextProps) {
    const { sort } = nextProps.sort;
    if (!this.state.sort && nextProps.sort) {
      this.setState({ sort });
    }
  }

  save = () => {
    const { fetchUserLibrary, navigation, currentUser, setLibrarySort } = this.props;
    const { sort } = this.state;

    // Save the sort
    setLibrarySort(sort.by, sort.ascending);

    // Update the user library
    if (currentUser) {
      fetchUserLibrary({ userId: currentUser.id, refresh: true });
    }

    navigation.goBack();
  };

  goBack = () => this.props.navigation.goBack();

  updateSort(sortBy, ascending) {
    this.setState({ sort: { by: sortBy, ascending } });
  }

  renderSortOptions() {
    const { sort } = this.state;
    return sortOptions.map((option) => {
      const sortKey = (sort && `${sort.by}-${sort.ascending}`) || '-';
      const key = `${sortKey}-${option.key}`;

      return (
        <TouchableOpacity
          key={key}
          onPress={() => sort && this.updateSort(option.key, sort.ascending)}
          style={styles.libraryOption}
        >
          <View style={{ flex: 1 }}>
            <StyledText color="light" size="small" textStle={styles.libraryOptionText}>{option.value}</StyledText>
          </View>
          { sort && sort.by === option.key &&
            <Icon name="ios-checkmark" color="white" style={styles.optionSelectedIcon} />
          }
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <CustomHeader
            leftButtonAction={this.goBack}
            leftButtonTitle="Back"
          />
        </View>
        <ScrollView style={{ flex: 1 }}>
          {this.renderSortOptions()}
          <View style={styles.saveButtonContainer}>
            <Button
              title="Save"
              onPress={this.save}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
