import React, { PureComponent } from 'react';
import { Linking, Platform, ScrollView, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';

import {
  bugs,
  contact,
  library,
  settings,
  suggest,
} from 'kitsu/assets/img/sidebar_icons';
import { Button } from 'kitsu/components/Button';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { defaultAvatar, defaultCover } from 'kitsu/constants/app';
import { darkPurple, listBackPurple } from 'kitsu/constants/colors';
import { Screens } from 'kitsu/navigation';
import { logoutUser } from 'kitsu/store/auth/actions';
import { getImgixCoverImage } from 'kitsu/utils/imgix';

import { SidebarListItem, SidebarTitle } from './common';
import { styles } from './styles';

interface SidebarScreenProps {
  currentUser?: object;
  accessToken?: string;
}

class SidebarScreen extends PureComponent<SidebarScreenProps> {
  static defaultProps = {
    currentUser: null,
    accessToken: '',
  };

  onViewProfile = () => {
    const { currentUser } = this.props;
    if (currentUser) {
      this.navigateTo(Screens.PROFILE_PAGE, { userId: currentUser.id });
    }
  };

  onActionPress = (item) => {
    const { accessToken } = this.props;
    switch (item.target) {
      case 'Settings':
        this.navigateTo(Screens.SIDEBAR_SETTINGS);
        break;
      case 'ReportBugs':
        this.navigateTo(Screens.SIDEBAR_CANNY_BOARD, {
          title: item.title,
          type: 'bugReport',
          token: accessToken,
        });
        break;
      case 'SuggestFeatures':
        this.navigateTo(Screens.SIDEBAR_CANNY_BOARD, {
          title: item.title,
          type: 'featureRequest',
          token: accessToken,
        });
        break;
      case 'DatabaseRequests':
        this.navigateTo(Screens.SIDEBAR_CANNY_BOARD, {
          title: item.title,
          type: 'databaseRequest',
          token: accessToken,
        });
        break;
      case 'mailto':
        Linking.openURL('mailto:help@kitsu.io');
        break;
      default:
        break;
    }
  };

  onLogout = () => {
    this.props.logoutUser();
  };

  get accountSections() {
    return {
      title: 'Account Settings',
      data: [
        {
          title: 'Settings & Preferences',
          image: settings,
          target: 'Settings',
        },
        { title: 'Report Bugs', image: bugs, target: 'ReportBugs' },
        {
          title: 'Suggest Features',
          image: suggest,
          target: 'SuggestFeatures',
        },
        {
          title: 'Database Requests',
          image: suggest,
          target: 'DatabaseRequests',
        },
        { title: 'Contact Us', image: contact, target: 'mailto' },
      ],
    };
  }

  navigateTo = (screen, props = {}) => {
    Navigation.mergeOptions(Screens.SIDEBAR, {
      sideMenu: {
        left: {
          visible: false,
        },
      },
    });
    Navigation.mergeOptions(Screens.BOTTOM_TABS, {
      bottomTabs: {
        currentTabId: Screens.FEED,
      },
    });
    Navigation.push(Screens.FEED, {
      component: {
        name: screen,
        passProps: props,
      },
    });
  };

  renderSectionHeader = (section) => <SidebarTitle title={section.title} />;

  renderSectionItem = (item) => (
    <SidebarListItem
      key={item.title}
      style={styles.sidebarListItem}
      image={item.image}
      title={item.title}
      onPress={() => this.onActionPress(item)}
    />
  );

  render() {
    const { avatar, coverImage, name } = this.props.currentUser;
    const iOSWidth = { width: 280 };
    return (
      // NOTE: 280px is the width of the sideMenu when expanded
      // We can set a custom width for it if we want however there is an issue on iOS
      // ref: https://github.com/wix/react-native-navigation/issues/3924
      // ref: https://github.com/wix/react-native-navigation/issues/3956
      <View
        style={[
          { flex: 1, backgroundColor: listBackPurple },
          Platform.OS === 'ios' && iOSWidth,
        ]}
      >
        {/* Header */}
        <ProgressiveImage
          hasOverlay
          style={styles.headerCoverImage}
          source={{
            uri: (coverImage && getImgixCoverImage(coverImage)) || defaultCover,
          }}
        >
          <View style={styles.userProfileContainer}>
            <FastImage
              style={styles.userProfileImage}
              source={{ uri: (avatar && avatar.medium) || defaultAvatar }}
              cache="web"
            />
            <View style={styles.userProfileTextWrapper}>
              <Text style={styles.userProfileName}>{name}</Text>
            </View>
          </View>
        </ProgressiveImage>

        <ScrollView style={{ flex: 1 }}>
          {/* View Profile */}
          <SidebarListItem
            style={styles.sidebarListItem}
            image={library}
            title="View Profile"
            onPress={this.onViewProfile}
          />

          {/* Account Settings */}
          {this.renderSectionHeader(this.accountSections)}
          {this.accountSections.data.map((item) =>
            this.renderSectionItem(item)
          )}

          {/* Logout */}
          <Button
            style={styles.logoutButton}
            title="Logout"
            icon="sign-out"
            onPress={this.onLogout}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ auth, user }) => ({
  accessToken: auth.tokens.access_token,
  currentUser: user.currentUser,
});

export default connect(mapStateToProps, { logoutUser })(SidebarScreen);
