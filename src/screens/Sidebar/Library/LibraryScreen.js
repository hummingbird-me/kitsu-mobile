import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
import { libraryImport, libraryExport } from 'kitsu/assets/img/sidebar_icons/';
import { updateLibrarySettings } from 'kitsu/store/user/actions/';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { navigationOptions, SidebarListItem, SidebarTitle, ItemSeparator, SidebarButton } from 'kitsu/screens/Sidebar/common/';
import { styles } from './styles';

const mediaPreferenceKeyToTitle = (key) => {
  const mapper = {
    romanized: 'Romanized',
    canonical: 'Most Common Usage',
    english: 'English',
  };
  return mapper[key];
};

const mediaPreferenceTitleToKey = (title) => {
  switch (title) {
    case 'Romanized': return 'romanized';
    case 'Most Common Usage': return 'canonical';
    case 'English': return 'english';
    default: return null;
  }
};

class LibraryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => navigationOptions(navigation, 'Library');

  // No mapping needed for Rating System, since API uses it as it is.
  // We just need to translate Canonical to Most Common Usage.
  state = {
    modified: false,
    titleLanguagePreference: mediaPreferenceKeyToTitle(this.props.titleLanguagePreference),
    ratingSystem: this.props.ratingSystem,
  };

  titleLanguagePreference = ['Romanized', 'Most Common Usage', 'English', 'cancel'];
  ratingSystem = ['simple', 'regular', 'advanced', 'cancel'];

  onUpdateLibrarySettings = () => {
    const { titleLanguagePreference, ratingSystem } = this.state;
    this.props.updateLibrarySettings({
      titleLanguagePreference: mediaPreferenceTitleToKey(titleLanguagePreference),
      ratingSystem,
    });
  };

  render() {
    const { navigation, loading } = this.props;
    const { modified, titleLanguagePreference, ratingSystem } = this.state;
    return (
      <View style={styles.containerStyle}>
        <SidebarTitle title={'Media Preferences'} />
        <SelectMenu
          style={styles.selectMenu}
          onOptionSelected={t => this.setState({ modified: true, titleLanguagePreference: t })}
          cancelButtonIndex={this.titleLanguagePreference.length - 1}
          options={this.titleLanguagePreference}
        >
          <View>
            <Text style={styles.hintText}>
              Title Display
            </Text>
            <Text style={styles.valueText}>
              { titleLanguagePreference }
            </Text>
          </View>
        </SelectMenu>
        <ItemSeparator />
        <SelectMenu
          style={styles.selectMenu}
          onOptionSelected={t => this.setState({ modified: true, ratingSystem: t })}
          cancelButtonIndex={this.ratingSystem.length - 1}
          options={this.ratingSystem}
        >
          <View>
            <Text style={styles.hintText}>
              Rating Type
            </Text>
            <Text style={styles.valueText}>
              { startCase(ratingSystem) }
            </Text>
          </View>
        </SelectMenu>
        <View>
          <SidebarTitle title={'Account Settings'} />
          <FlatList
            data={[
              { title: 'Import Library', image: libraryImport, target: 'ImportLibrary' },
              { title: 'Export Library', image: libraryExport, target: 'ExportLibrary' },
            ]}
            keyExtractor={item => item.title}
            renderItem={({ item }) => (
              <SidebarListItem
                title={item.title}
                image={item.image}
                onPress={() => navigation.navigate(item.target)}
              />
            )}
            ItemSeparatorComponent={() => <ItemSeparator />}
            removeClippedSubviews={false}
            scrollEnabled={false}
          />
        </View>
        <SidebarButton
          title={'Save Library Settings'}
          onPress={this.onUpdateLibrarySettings}
          loading={loading}
          disabled={!modified}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  titleLanguagePreference: user.currentUser.titleLanguagePreference,
  ratingSystem: user.currentUser.ratingSystem,
  loading: user.loading,
});

LibraryScreen.propTypes = {
  ratingSystem: PropTypes.string,
  titleLanguagePreference: PropTypes.string,
  updateLibrarySettings: PropTypes.func,
  loading: PropTypes.bool,
};

LibraryScreen.defaultProps = {
  ratingSystem: 'Simple',
  titleLanguagePreference: 'Canonical',
  updateLibrarySettings: null,
  loading: false,
};

export default connect(mapStateToProps, { updateLibrarySettings })(LibraryScreen);
