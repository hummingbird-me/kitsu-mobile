/*
  // TODO
  - get color code of black text, replace all #444.
  - reorganize styles
  - work on ListEmptyItems after react native upgrade
*/

import React from 'react';
import { View, Image, Text, SectionList, Platform, TouchableOpacity, Linking } from 'react-native';
import { connect } from 'react-redux';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { bugs, contact, library, suggest, settings } from 'kitsu/assets/img/sidebar_icons/';
import defaultAvatar from 'kitsu/assets/img/default_avatar.png';
import { defaultAvatar as defaultGroupAvatar, defaultCover } from 'kitsu/constants/app';
import { commonStyles } from 'kitsu/common/styles';
import { logoutUser } from 'kitsu/store/auth/actions';
import { fetchGroupMemberships } from 'kitsu/store/groups/actions';
import { SidebarListItem, SidebarTitle, ItemSeparator } from './common/';
import { styles } from './styles';

const settingsData = [
  { title: 'Settings & Preferences', image: settings, target: 'Settings' },
  { title: 'Report Bugs', image: bugs, target: 'ReportBugs' },
  { title: 'Suggest Features', image: suggest, target: 'SuggestFeatures' },
  { title: 'Database Requests', image: suggest, target: 'DatabaseRequests' },
  { title: 'Contact Us', image: contact, target: 'mailto' },
];

const keyExtractor = (item, index) => index;

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

  renderSectionSeparatorComponent = () => (
    <View height={20} />
  )

  renderSectionHeader = ({ section }) => (
    <SidebarTitle title={section.title} style={{ marginTop: 0 }} />
  );

  renderSectionFooter = ({ section }) => null;

  renderListHeaderComponent = () => <View height={10} />

  renderListFooterComponent = () => (
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
  )

  renderItemSeparatorComponent() {
    return <ItemSeparator />;
  }

  render() {
    const { navigation, currentUser, groupMemberships, accessToken } = this.props;
    const { name, avatar, coverImage } = currentUser;
    const groupsData = groupMemberships || [];

    const sectionListData = [
      {
        key: 'shortcuts',
        data: [{ title: 'View Library', image: library, target: 'UserLibraryScreen' }],
        title: 'Shortcuts',
        renderItem: ({ item }) => (
          <SidebarListItem
            image={item.image}
            title={item.title}
            onPress={() => {
              navigation.navigate(item.target, { profile: currentUser });
            }}
          />
        ),
        ItemSeparatorComponent: this.renderItemSeparatorComponent,
      },
      {
        key: 'groups',
        data: groupsData,
        title: 'Groups',
        renderItem: ({ item }) => {
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
        ItemSeparatorComponent: this.renderItemSeparatorComponent,
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
              switch (item.target) {
                case 'Settings':
                  navigation.navigate(item.target);
                  break;
                case 'ReportBugs':
                  navigation.navigate(item.target, { title: item.title, type: 'bugReport', token: accessToken });
                  break;
                case 'SuggestFeatures':
                  navigation.navigate(item.target, { title: item.title, type: 'featureRequest', token: accessToken });
                  break;
                case 'DatabaseRequests':
                  navigation.navigate(item.target, { title: item.title, type: 'databaseRequest', token: accessToken });
                  break;
                case 'mailto':
                  Linking.openURL('mailto:josh@kitsu.io');
                  break;
                default:
                  break;
              }
            }}
          />
        ),
        ItemSeparatorComponent: this.renderItemSeparatorComponent,
      },
    ];
    return (
      <View style={{ backgroundColor: colors.listBackPurple }}>
        <ProgressiveImage
          hasOverlay
          style={styles.headerCoverImage}
          source={{ uri: (coverImage && coverImage.large) || defaultCover }}
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
          keyExtractor={keyExtractor}
          ListHeaderComponent={this.renderListHeaderComponent}
          renderSectionHeader={this.renderSectionHeader}
          renderSectionFooter={this.renderSectionFooter}
          removeClippedSubviews={false}
          SectionSeparatorComponent={this.renderSectionSeparatorComponent}
          ListFooterComponent={this.renderListFooterComponent}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ auth, user, groups }) => ({
  accessToken: auth.tokens.access_token,
  currentUser: user.currentUser,
  groupMemberships: groups.groupMemberships,
});

SidebarScreen.propTypes = {};

export default connect(mapStateToProps, { fetchGroupMemberships, logoutUser })(SidebarScreen);
