import React, { PureComponent } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { blocking, library, privacy, settings, linked } from 'kitsu/assets/img/sidebar_icons/';
import { navigationOptions, SidebarTitle, ItemSeparator, SidebarListItem } from './common/';
import { styles } from './styles';

class SettingsScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => navigationOptions(navigation, 'Settings');

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.containerStyle}>
        <SidebarTitle title={'Account Settings'} />
        <FlatList
          data={[
            { title: 'General', image: settings, target: 'GeneralSettings' },
            { title: 'Privacy', image: privacy, target: 'PrivacySettings' },
            { title: 'Linked Accounts', image: linked, target: 'LinkedAccounts' },
            { title: 'Library', image: library, target: 'LibrarySettings' },
            { title: 'Blocking', image: blocking, target: 'Blocking' },
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
    );
  }
}

const mapStateToProps = ({ user }) => ({});

SettingsScreen.propTypes = {};

export default connect(mapStateToProps, {})(SettingsScreen);
