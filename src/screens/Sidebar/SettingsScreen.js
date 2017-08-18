import React, { Component } from 'react';
import { View, Image, FlatList, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Text, Button, Container, Icon, Left, Right, Item } from 'native-base';
import PropTypes from 'prop-types';
import SidebarHeader from './common/SidebarHeader';
import SidebarTitle from './common/SidebarTitle';
import SidebarListItem, { ItemSeparator } from './common/SidebarListItem';
import * as colors from '../../constants/colors';

import menu from '../../assets/img/tabbar_icons/menu.png';
import library from '../../assets/img/sidebar_icons/library.png';
import privacy from '../../assets/img/sidebar_icons/privacy.png';
import linked from '../../assets/img/sidebar_icons/linked.png';
import blocking from '../../assets/img/sidebar_icons/blocking.png';
import settings from '../../assets/img/sidebar_icons/settings.png';

class SettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => <SidebarHeader navigation={navigation} headerTitle={'Settings'} />,
    tabBarIcon: (
      { tintColor },
    ) => (
        <Image
          source={menu}
          style={{ tintColor, width: 20, height: 21 }}
        />
      ),
  });

  render() {
    const { navigation } = this.props;
    return ( // handle marginTop: 77
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
            renderItem={({ item }) => <SidebarListItem title={item.title} image={item.image} onPress={() => navigation.navigate(item.target)} />}
            ItemSeparatorComponent={() => <ItemSeparator />}
            removeClippedSubviews={false}
            scrollEnabled={false}
          />
        </View>
      </Container>
    );
  }
}

const styles = {
  containerStyle: { backgroundColor: colors.listBackPurple },
};

const mapStateToProps = ({ user }) => {
  return {
  };
};

SettingsScreen.propTypes = {
};

export default connect(mapStateToProps, {})(SettingsScreen);
