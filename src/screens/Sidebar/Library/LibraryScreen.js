import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';
import { libraryImport, libraryExport } from 'kitsu/assets/img/sidebar_icons/';
import { updateLibrarySettings } from 'kitsu/store/user/actions/';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { SidebarListItem, SidebarTitle, ItemSeparator, SidebarButton } from 'kitsu/screens/Sidebar/common/';
import { styles } from './styles';

class LibraryScreen extends React.Component {
  static navigationOptions = {
    title: 'Library',
  };

  state = {
    titleLanguagePreference: this.props.titleLanguagePreference,
    ratingSystem: this.props.ratingSystem,
  };

  titleLanguagePreference = ['romanized', 'canonical', 'english', 'cancel'];
  ratingSystem = ['simple', 'regular', 'advanced', 'cancel'];

  onUpdateTitlePreference = (value, option) => {
    switch (value) {
      case 'on':
        this.setState({ sfwFilter: false, selectMenuText: option.text });
        break;
      case 'off':
        this.setState({ sfwFilter: true, selectMenuText: option.text });
        break;
      default:
        // cancel button pressed.
        break;
    }
  };

  onUpdateLibrarySettings = () => {
    const { titleLanguagePreference, ratingSystem } = this.state;
    this.props.updateLibrarySettings({
      titleLanguagePreference,
      ratingSystem,
    });
  };

  render() {
    const { navigation, loading } = this.props;
    return (
      <View style={styles.containerStyle}>
        <SidebarTitle title={'Media Preferences'} />
        <SelectMenu
          style={styles.selectMenu}
          onOptionSelected={t => this.setState({ titleLanguagePreference: t })}
          cancelButtonIndex={this.titleLanguagePreference.length - 1}
          options={this.titleLanguagePreference}
        >
          <View>
            <Text style={styles.hintText}>
              Title Display
            </Text>
            <Text style={styles.valueText}>
              {startCase(this.state.titleLanguagePreference)}
            </Text>
          </View>
        </SelectMenu>
        <ItemSeparator />
        <SelectMenu
          style={styles.selectMenu}
          onOptionSelected={t => this.setState({ ratingSystem: t })}
          cancelButtonIndex={this.ratingSystem.length - 1}
          options={this.ratingSystem}
        >
          <View>
            <Text style={styles.hintText}>
              Rating Type
            </Text>
            <Text style={styles.valueText}>
              {startCase(this.state.ratingSystem)}
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
