/*
  // TODO
  - get color code of black text, replace all #444.
  - reorganize styles
  - work on ListEmptyItems after react native upgrade
  - imageURL replace default avatar with defaultGroupAvatar
*/

import React from 'react';
import { View, Image, Text, SectionList, Platform, TouchableOpacity, Linking } from 'react-native';
import { connect } from 'react-redux';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { bugs, contact, library, suggest, settings } from 'kitsu/assets/img/sidebar_icons/';
import defaultAvatar from 'kitsu/assets/img/default_avatar.png';
import { defaultAvatar as defaultGroupAvatar } from 'kitsu/constants/app';
import { commonStyles } from 'kitsu/common/styles';
import { logoutUser } from 'kitsu/store/auth/actions';
import { fetchGroupMemberships } from 'kitsu/store/groups/actions';
import { SidebarListItem, SidebarTitle, ItemSeparator } from './common/';
import styles from './styles';

const shortcutsData = [{ title: 'View Library', image: library, target: 'Library' }];
const settingsData = [
  { title: 'Settings & Preferences', image: settings, target: 'Settings' },
  { title: 'Report Bug', image: bugs, target: '' },
  { title: 'Suggest Features', image: suggest, target: 'SuggestFeatures' },
  { title: 'Contact Us', image: contact, target: 'mailto' },
];

class SidebarScreen extends React.Component {
  static navigationOptions = {
    header: null, // overlaps statusbar
  };

  componentDidMount() {
    this.props.fetchGroupMemberships();
  }

  onLogoutButtonPressed = () => {
    this.props.logoutUser(this.props.navigation);
  };

  navigateUserProfile = () => {
    // TODO: implement function.
  };

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
          <SidebarListItem
            image={item.image}
            title={item.title}
            onPress={() => {
              navigation.navigate(item.target);
            }}
          />
        ),
        ItemSeparatorComponent: () => <ItemSeparator />,
      },
      {
        // TODO: imageURL replace default avatar with defaultGroupAvatar
        key: 'groups',
        data: groupsData,
        title: 'Groups',
        renderItem: ({ item }) => {
          console.log(item);
          return (
            <SidebarListItem
              onPress={() => {
                navigation.navigate('');
              }}
              title={item.group.name}
              imageURL={
                (item.group.avatar &&
                  (item.group.avatar.small ||
                    item.group.avatar.medium ||
                    item.group.avatar.large ||
                    item.group.avatar.original)) ||
                  defaultGroupAvatar
              }
            />
          );
        },
        ListEmptyComponent: () => <Text style={{ color: 'white' }}>Fetching Groups</Text>,
        ItemSeparatorComponent: () => <ItemSeparator />,
      },
      {
        key: 'settings',
        data: settingsData,
        title: 'Account Settings',
        renderItem: ({ item }) => (
          <SidebarListItem
            image={item.image}
            title={item.title}
            onPress={() => {
              if (item.target === 'mailto') {
                Linking.openURL('mailto:josh@kitsu.io');
              } else {
                navigation.navigate(item.target);
              }
            }}
          />
        ),
        ItemSeparatorComponent: () => <ItemSeparator />,
      },
    ];
    return (
      <View style={{ backgroundColor: colors.listBackPurple }}>
        <ProgressiveImage
          hasOverlay
          style={styles.headerCoverImage}
          source={{ uri: 'https://fubukinofansub.files.wordpress.com/2011/12/cover-03-04.jpg' }}
        >
          <View
            style={{
              flex: 1,
              marginTop: Platform.select({ ios: 20, android: 24 }),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                marginTop: 12,
                marginHorizontal: 12,
                padding: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={this.navigateUserProfile}
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
            </TouchableOpacity>
          </View>
        </ProgressiveImage>
        <SectionList
          contentContainerStyle={{ paddingBottom: 100 }}
          sections={sectionListData}
          keyExtractor={(item, index) => index}
          ListHeaderComponent={() => <View height={10} />}
          renderItem={() => <SidebarListItem />}
          renderSectionHeader={({ section }) => (
            <SidebarTitle title={section.title} style={{ marginTop: 0 }} />
          )}
          renderSectionFooter={({ section }) => {
            // THIS FUNCTION IS NOT BEING INVOKED !?
          }}
          removeClippedSubviews={false}
          SectionSeparatorComponent={() => <View height={20} />}
          ListFooterComponent={() => (
            <TouchableOpacity
              onPress={this.onLogoutButtonPressed}
              style={{
                marginVertical: 40,
                padding: 12,
                backgroundColor: colors.white,
                alignItems: 'center',
              }}
            >
              <Text
                style={[
                  commonStyles.text,
                  {
                    fontWeight: '500',
                    color: colors.activeRed,
                  },
                ]}
              >
                Log Out
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ user, groups }) => {
  const { currentUser } = user;
  const { groupMemberships } = groups;
  return {
    currentUser,
    groupMemberships,
  };
};

SidebarScreen.propTypes = {};

export default connect(mapStateToProps, { fetchGroupMemberships, logoutUser })(SidebarScreen);
