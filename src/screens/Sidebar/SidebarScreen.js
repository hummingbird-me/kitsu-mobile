/*
  // TODO
  - reorganize styles
  - navigationoptions from router?
*/

import React, { Component } from 'react';
import { View, Image, SectionList, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import ProgressiveImage from 'kitsu/components/ProgressiveImage';
import { Text, Container, Icon, Left, Right, Item } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import menu from 'kitsu/assets/img/tabbar_icons/menu.png';
import { bugs, contact, library, suggest, settings } from 'kitsu/assets/img/sidebar_icons/';
import defaultAvatar from 'kitsu/assets/img/default_avatar.png';
import { fetchGroupMemberships } from 'kitsu/store/groups/actions';
import { SidebarListItem, SidebarTitle, ItemSeparator } from './common/';

const shortcutsData = [{ title: 'View Library', image: library, target: 'Library' }];
const settingsData = [
  { title: 'Settings & Preferences', image: settings, target: 'Settings' },
  { title: 'Report Bug', image: bugs, target: '' },
  { title: 'Suggest Features', image: suggest, target: '' },
  { title: 'Contact Us', image: contact, target: '' },
];
const LeftIconWrapper = (
  { children }, // have a standard width at all items.
) => (
  <View style={{ width: 25, alignItems: 'center' }}>
    {children}
  </View>
);
const SettingsItem = ({ image, title, onPress }) => (
  <SidebarListItem image={image} title={title} onPress={onPress} />
);
const GroupsItem = ({ imageURL, title, onPress }) => (
  <Item button onPress={onPress} style={styles.sectionListItem}>
    <Left>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <LeftIconWrapper>
          <Image
            source={{ uri: imageURL }}
            resizeMode={'stretch'}
            style={{ width: 20, height: 20, borderRadius: 4 }}
          />
        </LeftIconWrapper>
        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 8, color: '#444' }}>
          {title}
        </Text>
      </View>
    </Left>
    <Right>
      <Icon name={'ios-arrow-forward'} style={{ color: colors.lightGrey, fontSize: 16 }} />
    </Right>
  </Item>
);

const SectionTitle = ({ title }) => <SidebarTitle title={title} />;

class SidebarScreen extends Component {
  static navigationOptions = {
    header: null, // overlaps statusbar
    tabBarIcon: ({ tintColor }) => (
      <Image source={menu} style={{ tintColor, width: 20, height: 21 }} />
    ),
  };

  componentDidMount() {
    this.props.fetchGroupMemberships();
  }

  render() {
    const { navigation, currentUser, groupMemberships } = this.props;
    const { name, avatar } = currentUser;
    const groupsData = groupMemberships || [];

    const sectionListData = [
      {
        key: 'shortcuts',
        data: shortcutsData,
        title: 'Shortcuts',
        renderItem: ({ item }) => (
          <SettingsItem
            onPress={() => {
              navigation.navigate(item.target);
            }}
            title={item.title}
            image={item.image}
          />
        ),
        ItemSeparatorComponent: () => <ItemSeparator />,
      },
      {
        key: 'groups',
        data: groupsData,
        title: 'Groups',
        renderItem: ({ item }) => (
          <GroupsItem
            onPress={() => {
              navigation.navigate('');
            }}
            title={item.group.name}
            imageURL={item.group.avatar.small}
          />
        ),
        ListEmptyComponent: () => <Text style={{ color: 'white' }}>Fetching Groups</Text>,
        ItemSeparatorComponent: () => <ItemSeparator />,
      },
      {
        key: 'settings',
        data: settingsData,
        title: 'Account Settings',
        renderItem: ({ item }) => (
          <SettingsItem
            onPress={() => {
              navigation.navigate(item.target);
            }}
            title={item.title}
            image={item.image}
          />
        ),
        ItemSeparatorComponent: () => <ItemSeparator />,
      },
    ];
    return (
      <Container style={styles.containerStyle}>
        <View>
          <ProgressiveImage
            hasOverlay
            style={{ height: 100, justifyContent: 'center' }}
            source={{ uri: 'https://fubukinofansub.files.wordpress.com/2011/12/cover-03-04.jpg' }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                paddingTop: Platform.select({ ios: 20, android: 24 }),
                alignItems: 'center',
                marginLeft: 20,
              }}
            >
              <Image
                style={{ width: 40, height: 40, borderRadius: 20 }}
                source={(avatar && { uri: avatar.tiny }) || defaultAvatar}
              />
              <View style={{ marginLeft: 12, backgroundColor: 'transparent' }}>
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    color: colors.white,
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                >
                  {name}
                </Text>
                <Text style={{ fontFamily: 'OpenSans', color: colors.white, fontSize: 10 }}>
                  view profile
                </Text>
              </View>
            </View>
          </ProgressiveImage>
          <SectionList
            contentContainerStyle={{ paddingBottom: 100 }}
            sections={sectionListData}
            keyExtractor={(item, index) => index}
            ListHeaderComponent={() => <View height={20} />}
            renderItem={() => <SettingsItem />}
            renderSectionHeader={({ section }) => <SectionTitle title={section.title} />}
            renderSectionFooter={({ section }) => {
              // THIS FUNCTION IS NOT BEING INVOKED !?
            }}
            removeClippedSubviews={false}
            SectionSeparatorComponent={() => <View height={28} />}
            ListFooterComponent={() => (
              <View
                style={{
                  marginTop: 40,
                  padding: 12,
                  backgroundColor: colors.white,
                  alignItems: 'center',
                }}
              >
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
              </View>
            )}
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
    marginLeft: 0,
  },
};

const mapStateToProps = ({ user, groups }) => {
  const { currentUser } = user;
  const { groupMemberships } = groups;
  return {
    currentUser,
    groupMemberships,
  };
};

SidebarScreen.propTypes = {};

export default connect(mapStateToProps, { fetchGroupMemberships })(SidebarScreen);
