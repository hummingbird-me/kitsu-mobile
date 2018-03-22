import React, { PureComponent } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { PropTypes } from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import { libraryImport, libraryExport } from 'kitsu/assets/img/sidebar_icons/';
import * as colors from 'kitsu/constants/colors';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { capitalize, lowerCase, isEmpty } from 'lodash';
import { Kitsu } from 'kitsu/config/api';
import { navigationOptions, SidebarListItem, SidebarTitle, SidebarButton } from 'kitsu/screens/Sidebar/common/';
import { styles } from './styles';
import { SORT_OPTIONS } from './sortOptions';
import SidebarHeader from '../../common/SidebarHeader';

const mediaPreferenceKeyToTitle = (key) => {
  const mapper = {
    romanized: 'Romanized',
    canonical: 'Most Common Usage',
    english: 'English',
  };
  return mapper[key] || '-';
};

const mediaPreferenceTitleToKey = (title) => {
  switch (title) {
    case 'Romanized': return 'romanized';
    case 'Most Common Usage': return 'canonical';
    case 'English': return 'english';
    default: return null;
  }
};

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
    navigateBackOnSave: PropTypes.bool,
  };

  static defaultProps = {
    navigateBackOnSave: false,
  }

  constructor(props) {
    super(props);

    const { sort, currentUser } = props;

    this.state = {
      sortBy: (sort && sort.by) || 'updated_at',
      ascending: !!(sort && sort.ascending),
      ratingSystem: (currentUser && currentUser.ratingSystem) || 'simple',
      titleLanguagePreference: (currentUser && lowerCase(currentUser.titleLanguagePreference)) || 'canonical',
      saving: false,
    };
  }

  save = async () => {
    const {
      fetchUserLibrary,
      navigation,
      currentUser,
      setLibrarySort,
      fetchCurrentUser,
      navigateBackOnSave,
    } = this.props;
    const { sortBy, ascending, saving, ratingSystem, titleLanguagePreference } = this.state;

    // Only save if we're not already saving
    if (saving) return;

    this.setState({ saving: true });

    // Save the sort
    setLibrarySort(sortBy, ascending);

    // See if any changes need to be made
    if (currentUser) {
      const changes = {};

      // Rating
      if (currentUser.ratingSystem !== ratingSystem) {
        changes.ratingSystem = ratingSystem;
      }

      // Media title preferences
      if (lowerCase(currentUser.titleLanguagePreference) !== titleLanguagePreference) {
        changes.titleLanguagePreference = titleLanguagePreference;
      }

      // Only update user if we have changes
      if (!isEmpty(changes)) {
        // Update the rating system
        await Kitsu.update('users', { id: currentUser.id, ...changes });

        // Fetch the new user object
        await fetchCurrentUser();
      }

      // Update the user library
      fetchUserLibrary({ userId: currentUser.id, refresh: true });
    }

    this.setState({ saving: false });

    if (navigation && navigateBackOnSave) navigation.goBack();
  };

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
    const { ratingSystem, titleLanguagePreference } = this.state;

    return {
      heading: 'Media Preferences',
      rows: [
        {
          title: 'Title Display',
          value: mediaPreferenceKeyToTitle(titleLanguagePreference),
          options: ['Romanized', 'Most Common Usage', 'English', 'Nevermind'],
          onOptionSelected: (value) => {
            const newValue = mediaPreferenceTitleToKey(value);
            if (newValue) {
              this.setState({
                titleLanguagePreference: newValue,
              });
            }
          },
        },
        {
          title: 'Rating Type',
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

  goBack = () => {
    if (!this.state.saving) {
      this.props.navigation.goBack();
    }
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
      <View key={setting.heading}>
        <SidebarTitle title={setting.heading} />
        {setting.rows.map(row => this.renderSettingRow(row))}
      </View>
    ));
  }

  render() {
    const { navigation } = this.props;
    const { saving } = this.state;

    const settings = [this.librarySorting(), this.mediaPreferences(), this.manageLibrary()];

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <SidebarHeader
            navigation={navigation}
            headerTitle={'Library Settings'}
            onBackPress={this.goBack}
          />
        </View>
        <ScrollView style={{ flex: 1 }}>
          {this.renderSettings(settings)}
          <SidebarButton
            title={'Save'}
            onPress={this.save}
            loading={saving}
            disabled={false}
          />
        </ScrollView>
      </View>
    );
  }
}
