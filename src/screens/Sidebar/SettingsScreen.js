import React from 'react';
import { View, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Container } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import menu from 'kitsu/assets/img/tabbar_icons/menu.png';
import { blocking, library, privacy, settings, linked } from 'kitsu/assets/img/sidebar_icons/';
import { SidebarHeader, SidebarTitle, ItemSeparator, SidebarListItem } from './common/';

class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => <SidebarHeader navigation={navigation} headerTitle={'Settings'} />,
    tabBarIcon: ({ tintColor }) => (
      <Image source={menu} style={{ tintColor, width: 20, height: 21 }} />
    ),
  });

  render() {
    const { navigation } = this.props;
    return (
      // handle marginTop: 77
      (
        <Container style={styles.containerStyle}>
          <View style={{ marginTop: 77 }}>
            <SidebarTitle style={{ marginTop: 20 }} title={'Account Settings'} />
            <FlatList
              data={[
                { title: 'General', image: settings, target: 'GeneralSettings' },
                { title: 'Privacy', image: privacy, target: 'PrivacySettings' },
                { title: 'Linked Accounts', image: linked, target: 'LinkedAccounts' },
                { title: 'Library', image: library, target: 'Library' },
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
        </Container>
      )
    );
  }
}

const styles = {
  containerStyle: { backgroundColor: colors.listBackPurple },
};

const mapStateToProps = ({ user }) => ({});

SettingsScreen.propTypes = {};

export default connect(mapStateToProps, {})(SettingsScreen);
