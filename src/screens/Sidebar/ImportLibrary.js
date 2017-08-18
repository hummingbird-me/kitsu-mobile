import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Platform, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Text, Button, Container, Content, Spinner, Switch, Icon, Left, Right, Item } from 'native-base';
import PropTypes from 'prop-types';
import SidebarHeader from './common/SidebarHeader';
import SidebarTitle from './common/SidebarTitle';
import SidebarDropdown from './common/SidebarDropdown';
import SidebarListItem, { ItemSeparator } from './common/SidebarListItem';
import * as colors from '../../constants/colors';

import menu from '../../assets/img/tabbar_icons/menu.png';
import library from '../../assets/img/sidebar_icons/library.png';

const MediaItem = ({ title, logoURL }) => (
  <Item button style={styles.sectionListItem}>
    <View style={{ justifyContent: 'center', marginLeft: 8 }}>
      <Image source={{ uri: logoURL }} style={{ width: 100, height: 24, resizeMode: 'contain', borderRadius: 12 }} />
      <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: colors.darkGrey }}>
        {title}
      </Text>
    </View>
    <Right>
      <Icon name={'ios-arrow-forward'} style={{ color: colors.lightGrey, fontSize: 16 }} />
    </Right>
  </Item>
);

const ImportItem = ({ title, details, status, date }) => (
  <Item button style={styles.sectionListItem}>
    <View style={{ justifyContent: 'center', marginLeft: 8 }}>
      <Text style={{ fontWeight: '600', fontFamily: 'OpenSans', fontSize: 12 }}>
        {title}
      </Text>
      <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: colors.darkGrey }}>
        {details}
      </Text>
    </View>
    <Right>
      <Icon name={'ios-arrow-forward'} style={{ color: colors.lightGrey, fontSize: 16 }} />
    </Right>
  </Item>
);

class ImportLibrary extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => <SidebarHeader navigation={navigation} headerTitle={'Import Library'} />,
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
          <SidebarTitle style={{ marginTop: 20 }} title={'Import Media'} />
          <FlatList
            data={[
              { title: 'Import anime & manga library', logoURL: 'https://i2.wp.com/www.otakutale.com/wp-content/uploads/2015/07/MyAnimeList-Logo.jpg?resize=800%2C136', target: '' },
              { title: 'Import anime & manga library', logoURL: 'https://anilist.co/img/logo_anilist.png', target: '' },
            ]}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => <MediaItem logoURL={item.logoURL} title={item.title} />}
            ItemSeparatorComponent={() => <ItemSeparator />}
            removeClippedSubviews={false}
          />
          <SidebarTitle style={{ marginTop: 20 }} title={'Previous Imports'} />
          <FlatList
            data={[
              { title: 'Myanimelist', details: 'Currently importing 231 titles', status: 'syncing', date: '' },
              { title: 'Myanimelist', details: 'Successfully imported 231 titles', status: 'success', date: '' },
              { title: 'Anilist', details: 'Failed to import 231 titles. Try again later.', status: 'fail', date: '' },
            ]}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => <ImportItem title={item.title} details={item.details} date={item.date} status={item.status} />}
            ItemSeparatorComponent={() => <ItemSeparator />}
            removeClippedSubviews={false}
          />
        </View>
      </Container>
    );
  }
}

const styles = {
  containerStyle: { backgroundColor: colors.listBackPurple },
  sectionListItem: {
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 0,
    borderColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0,
    marginLeft: 0 // FUCKING STUPID NATIVEBASE.
  },
};

const mapStateToProps = ({ user }) => {
  return {
  };
};

ImportLibrary.propTypes = {
};

export default connect(mapStateToProps, {})(ImportLibrary);
