import React from 'react';
import { View, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Container } from 'native-base';
import * as colors from 'kitsu/constants/colors';
import menu from 'kitsu/assets/img/tabbar_icons/menu.png';
import { libraryImport, libraryExport } from 'kitsu/assets/img/sidebar_icons/';
import PropTypes from 'prop-types';
import { updateLibrarySettings } from 'kitsu/store/user/actions/';
import {
  SidebarHeader,
  SidebarListItem,
  SidebarTitle,
  ItemSeparator,
  SidebarDropdown,
  SidebarButton,
} from './common/';

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
      <Container style={styles.containerStyle}>
        <View style={{ marginTop: 77 }}>
          <SidebarTitle style={{ marginTop: 20 }} title={'Media Preferences'} />
          <SidebarDropdown
            title={'Title Display'}
            value={this.state.titleLanguagePreference}
            options={[
              { title: 'Option 1 has a long text' },
              { title: 'Option 2 also has a long text' },
              { title: 'Option 3' },
            ]}
            onSelectOption={option => this.setState({ titleLanguagePreference: option.title })}
          />
          <ItemSeparator />
          <SidebarDropdown
            title={'Rating Value'}
            value={this.state.ratingSystem}
            options={[
              { title: 'Option 1 has a long text' },
              { title: 'Option 2' },
              {
                title: "Option 3 times 3 is Option 9 and we don't have it. Let's just say option 3 has the longest text we could imagine",
              },
            ]}
            onSelectOption={option => this.setState({ ratingSystem: option.title })}
          />
          <SidebarTitle style={{ marginTop: 20 }} title={'Account Settings'} />
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
          <SidebarButton
            title={'Save Library Settings'}
            onPress={this.onUpdateLibrarySettings}
            loading={loading}
          />
        </View>
      </Container>
    );
  }
}

const styles = {
  containerStyle: { backgroundColor: colors.listBackPurple },
};

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
