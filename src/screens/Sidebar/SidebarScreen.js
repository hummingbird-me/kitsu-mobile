/*
  // TODO
  - use svgs
  - reorganize styles
  - navigationoptions from router?
*/

import React, { Component } from 'react';
import { View, Image, SectionList, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import ProgressiveImage from '../../components/ProgressiveImage';
import { Text, Button, Container, Icon, Left, Right, Item } from 'native-base';
import PropTypes from 'prop-types';
// import Icon from '../../components/Icon';
import * as colors from '../../constants/colors';

import menu from '../../assets/img/tabbar_icons/menu.png';
import bugs from '../../assets/img/sidebar_icons/bugs.png';
import contact from '../../assets/img/sidebar_icons/contact.png';
import library from '../../assets/img/sidebar_icons/library.png';
import suggest from '../../assets/img/sidebar_icons/suggest.png';
import settings from '../../assets/img/sidebar_icons/settings.png';
import defaultAvatar from '../../assets/img/default_avatar.png';

import SidebarTitle from './common/SidebarTitle';
import SidebarListItem from './common/SidebarListItem';

const shortcutsData = [
  { title: 'View Library', image: library, target: 'Library' },
];

const groupsData = [
  { title: 'Weekly Shonen Jump', imageURL: 'https://fubukinofansub.files.wordpress.com/2011/12/cover-03-04.jpg', target: '' },
  { title: 'Kitsu News Network', imageURL: 'https://media.kitsu.io/groups/avatars/596/large.png?1490733214', target: '' },
  { title: 'Food Fighters! (Cooking Club)', imageURL: 'https://media.kitsu.io/groups/avatars/91/large.gif?1424396944', target: '' }
];

const settingsData = [
  { title: 'Settings & Preferences', image: settings, target: 'Settings' },
  { title: 'Report Bug', image: bugs, target: '' },
  { title: 'Suggest Features', image: suggest, target: '' },
  { title: 'Contact Us', image: contact, target: '' },
];

const LeftIconWrapper = ({ children }) => (
  // have a standard width at all items.
  <View style={{ width: 25, alignItems: 'center' }}>
    {children}
  </View>
);

const SettingsItem = ({ image, title, onPress }) => <SidebarListItem image={image} title={title} onPress={onPress} />

const GroupsItem = ({ imageURL, title, onPress }) => (
  <Item button onPress={onPress} style={styles.sectionListItem}>
    <Left>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <LeftIconWrapper>
          <Image source={{uri: imageURL}} resizeMode={'stretch'} style={{ width: 20, height: 20, borderRadius: 4 }} />
        </LeftIconWrapper>
        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 8, color: '#444' }}>{title}</Text>
      </View>
    </Left>
    <Right>
      <Icon name={'ios-arrow-forward'} style={{ color: colors.lightGrey, fontSize: 16 }} />
    </Right>
  </Item>
);

const SectionTitle = ({ title }) => <SidebarTitle title={title} />;

const ItemSeparator = () => (
  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.imageGrey}} />
);

class SidebarScreen extends Component {
  static navigationOptions = {
    header: null, // overlaps statusbar
    tabBarIcon: (
      { tintColor },
    ) => (
      <Image
        source={menu}
        style={{ tintColor, width: 20, height: 21 }}
      />
    ),
  };

  render() {
    const { navigation } = this.props;
    const sectionListData = [
      {
        key: 'shortcuts',
        data: shortcutsData,
        title: 'Shortcuts',
        renderItem: ({ item }) => <SettingsItem onPress={() => { navigation.navigate(item.target); }} title={item.title} image={item.image} />,
        ItemSeparatorComponent: () => <ItemSeparator />,
      },
      {
        key: 'groups',
        data: groupsData,
        title: 'Groups',
        renderItem: ({ item }) => <GroupsItem onPress={() => { navigation.navigate(item.target); }} title={item.title} imageURL={item.imageURL} />,
        ItemSeparatorComponent: () => <ItemSeparator />,
      },
      {
        key: 'settings',
        data: settingsData,
        title: 'Account Settings',
        renderItem: ({ item }) => <SettingsItem onPress={() => { navigation.navigate(item.target); }} title={item.title} image={item.image} />,
        ItemSeparatorComponent: () => <ItemSeparator />,
      },
    ];
    return (
      <Container style={styles.containerStyle}>
        <View>
          <ProgressiveImage hasOverlay style={{ height: 100, justifyContent: 'center' }} source={{ uri: 'https://fubukinofansub.files.wordpress.com/2011/12/cover-03-04.jpg' }}>
            <View style={{ flex: 1, flexDirection: 'row', paddingTop: Platform.select({ ios: 20, android: 24 }), alignItems: 'center', marginLeft: 20 }}>
              <Image style={{ width: 40, height: 40, borderRadius: 20 }} source={defaultAvatar} />
              <View style={{ marginLeft: 12, backgroundColor: 'transparent' }}>
                <Text style={{ fontFamily: 'OpenSans', color: colors.white, fontSize: 14, fontWeight: '600' }}>Dummy UI</Text>
                <Text style={{ fontFamily: 'OpenSans', color: colors.white, fontSize: 10 }}>view profile</Text>
              </View>
            </View>
          </ProgressiveImage>
          <SectionList
            contentContainerStyle={{ paddingBottom: 100 }}
            sections={sectionListData}
            keyExtractor={item => item.title}
            ListHeaderComponent={() => <View height={20} />}
            renderItem={() => <SettingsItem />}
            renderSectionHeader={({ section }) => <SectionTitle title={section.title} />}
            renderSectionFooter={({ section }) => {
              // THIS FUNCTION IS NOT BEING INVOKED !?
            }}
            removeClippedSubviews={false}
            SectionSeparatorComponent={() => <View height={28} />}
            ListFooterComponent={() => <View style={{ marginTop: 40, padding: 12, backgroundColor: colors.white, alignItems: 'center'}} >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'OpenSans',
                  fontWeight: '500',
                  color: colors.activeRed,
                }}
              >
                Log Out
              </Text>
            </View>}
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
    padding: 8,
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

SidebarScreen.propTypes = {
};

export default connect(mapStateToProps, { })(SidebarScreen);
