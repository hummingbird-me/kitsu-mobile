import React, { PureComponent } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { PropTypes } from 'prop-types';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import { libraryImport, libraryExport } from 'kitsu/assets/img/sidebar_icons/';
import { SidebarListItem } from 'kitsu/screens/Sidebar/common/';
import * as colors from 'kitsu/constants/colors';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { capitalize } from 'lodash';
import { Kitsu } from 'kitsu/config/api';
import { styles } from './styles';
import { SORT_OPTIONS } from './sortOptions';

export class LibrarySettingsComponent extends PureComponent {
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

  constructor(props) {
    super(props);

    const { sort, currentUser } = props;

    this.state = {
      sortBy: (sort && sort.by) || 'updated_at',
      ascending: !!(sort && sort.ascending),
      ratingSystem: (currentUser && currentUser.ratingSystem) || 'simple',
      saving: false,
    };
  }

  save = async () => {
    const { fetchUserLibrary, navigation, currentUser, setLibrarySort, fetchCurrentUser } = this.props;
    const { sortBy, ascending, saving, ratingSystem } = this.state;

    // Only save if we're not already saving
    if (saving) return;

    this.setState({ saving: true });

    // Save the sort
    setLibrarySort(sortBy, ascending);

    // Check if rating needs to be changed
    if (currentUser && currentUser.ratingSystem !== ratingSystem) {
      // Update the rating system
      await Kitsu.update('users', { id: currentUser.id, ratingSystem });

      // Fetch the new user object
      await fetchCurrentUser();
    }

    // Update the user library
    if (currentUser) {
      fetchUserLibrary({ userId: currentUser.id, refresh: true });
    }

    this.setState({ saving: false });

    if (navigation) navigation.goBack();
  };

  goBack = () => {
    if (!this.state.saving) {
      this.props.navigation.goBack();
    }
  }

  librarySorting() {
    const { sortBy, ascending } = this.state;
    const filteredOption = SORT_OPTIONS.filter(e => e.key === sortBy);
    const currentSort = filteredOption && filteredOption[0] && filteredOption[0].text;

    return {
      heading: 'Library Sorting',
      rows: [
        {
          title: 'Sort by',
          value: currentSort || '-',
          options: [...SORT_OPTIONS, 'Nevermind'],
          onOptionSelected: (value, option) => {
            this.setState({
              sortBy: option.key,
            });
          },
        },
        {
          title: 'Direction',
          value: ascending ? 'Ascending' : 'Descending',
          options: ['Ascending', 'Descending', 'Nevermind'],
          onOptionSelected: (value) => {
            this.setState({
              ascending: value === 'Ascending',
            });
          },
        },
      ],
    };
  }

  mediaPreferences() {
    const { ratingSystem } = this.state;

    return {
      heading: 'Media Preferences',
      rows: [
        {
          title: 'Rating System',
          value: capitalize(ratingSystem),
          options: ['Simple', 'Regular', 'Advanced', 'Nevermind'],
          onOptionSelected: (value) => {
            this.setState({
              ratingSystem: value.toLowerCase(),
            });
          },
        },
      ],
    };
  }

  manageLibrary() {
    return {
      heading: 'Manage Library',
      rows: [
        {
          renderRow: this.renderSideBarRow,
          title: 'Import Library',
          image: libraryImport,
          target: 'ImportLibrary',
        },
        {
          renderRow: this.renderSideBarRow,
          title: 'Export Library',
          image: libraryExport,
          target: 'ExportLibrary',
        },
      ],
    };
  }

  renderSideBarRow = (row) => {
    const { navigation } = this.props;
    return (
      <SidebarListItem
        key={row.title}
        title={row.title}
        image={row.image}
        onPress={() => navigation.navigate(row.target)}
        style={styles.customRow}
      />
    );
  }

  renderSettingRow(row) {
    if (row.renderRow) return row.renderRow(row);
    return (
      <SelectMenu
        key={row.title}
        options={row.options}
        onOptionSelected={row.onOptionSelected}
        activeOpacity={0.8}
      >
        <View style={styles.settingRow}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.hintText}>{row.title}</Text>
            <Text style={styles.valueText}>{row.value}</Text>
          </View>
          <Icon
            name={'ios-arrow-forward'}
            color={colors.lightGrey}
            size={16}
          />
        </View>
      </SelectMenu>
    );
  }

  renderSettings(settings) {
    return settings.map(setting => (
      <View key={setting.heading} style={styles.settingContainer}>
        <Text style={styles.settingHeader}>{setting.heading}</Text>
        {setting.rows.map(row => this.renderSettingRow(row))}
      </View>
    ));
  }

  render() {
    const { saving } = this.state;

    const settings = [this.librarySorting(), this.mediaPreferences(), this.manageLibrary()];

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <CustomHeader
            title="Library Settings"
            leftButtonAction={this.goBack}
            leftButtonTitle="Back"
            rightButtonAction={this.save}
            rightButtonTitle={saving ? 'Saving' : 'Save'}
          />
        </View>
        <ScrollView style={{ flex: 1 }}>
          {this.renderSettings(settings)}
        </ScrollView>
      </View>
    );
  }
}
