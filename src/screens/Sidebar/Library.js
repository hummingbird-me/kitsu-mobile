import React from 'react';
import { View, Image, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import { Container } from 'native-base';
import * as colors from 'kitsu/constants/colors';
import menu from 'kitsu/assets/img/tabbar_icons/menu.png';
import { libraryImport, libraryExport } from 'kitsu/assets/img/sidebar_icons/';
import PropTypes from 'prop-types';
import { updateLibrarySettings } from 'kitsu/store/user/actions/';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { startCase } from 'lodash';
import {
  SidebarHeader,
  SidebarListItem,
  SidebarTitle,
  ItemSeparator,
  SidebarButton,
} from './common/';
import styles from './styles';

class Library extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => <SidebarHeader navigation={navigation} headerTitle={'Library'} />,
    tabBarIcon: ({ tintColor }) => (
      <Image source={menu} style={{ tintColor, width: 20, height: 21 }} />
    ),
  });

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
    const { navigation } = this.props;
    const loading = false; // TODO: make this work.
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
              Title Display
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
              { title: 'Export Library', image: libraryExport, target: '' },
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
});

Library.propTypes = {
  ratingSystem: PropTypes.string,
  titleLanguagePreference: PropTypes.string,
  updateLibrarySettings: PropTypes.func,
};

Library.defaultProps = {
  ratingSystem: 'Simple',
  titleLanguagePreference: 'Canonical',
  updateLibrarySettings: null,
};

export default connect(mapStateToProps, { updateLibrarySettings })(Library);
