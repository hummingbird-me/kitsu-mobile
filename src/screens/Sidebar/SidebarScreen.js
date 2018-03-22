import React, { PureComponent } from 'react';
import FastImage from 'react-native-fast-image';
import { View, Text, SectionList, Linking } from 'react-native';
import { connect } from 'react-redux';

import { logoutUser } from 'kitsu/store/auth/actions';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { getImgixCoverImage } from 'kitsu/utils/coverImage';
import { library, settings, bugs, suggest, contact } from 'kitsu/assets/img/sidebar_icons';
import { extraDarkPurple } from 'kitsu/constants/colors';
import { Button } from 'kitsu/components/Button';
import { defaultCover, defaultAvatar } from 'kitsu/constants/app';
import { SidebarListItem, SidebarTitle } from './common';
import { styles } from './styles';


class SidebarScreen extends PureComponent {
  onViewProfile = () => {
    const { currentUser, navigation } = this.props;
    navigation.navigate('ProfilePages', { userId: currentUser.id });
  };

  onActionPress = (item) => {
    const { navigation, accessToken } = this.props;
    switch (item.target) {
      case 'Settings':
        navigation.navigate(item.target);
        break;
      case 'ReportBugs':
        navigation.navigate(item.target, {
          title: item.title,
          type: 'bugReport',
          token: accessToken,
        });
        break;
      case 'SuggestFeatures':
        navigation.navigate(item.target, {
          title: item.title,
          type: 'featureRequest',
          token: accessToken,
        });
        break;
      case 'DatabaseRequests':
        navigation.navigate(item.target, {
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
        { title: 'Settings & Preferences', image: settings, target: 'Settings' },
        { title: 'Report Bugs', image: bugs, target: 'ReportBugs' },
        { title: 'Suggest Features', image: suggest, target: 'SuggestFeatures' },
        { title: 'Database Requests', image: suggest, target: 'DatabaseRequests' },
        { title: 'Contact Us', image: contact, target: 'mailto' },
      ],
    };
  }

  renderSectionHeader = section => (
    <SidebarTitle title={section.title} />
  );

  renderSectionItem = (item) => {
    return (
      <SidebarListItem
        key={item.title}
        style={styles.sidebarListItem}
        image={item.image}
        title={item.title}
        onPress={() => this.onActionPress(item)}
      />
    );
  };

  render() {
    const { avatar, coverImage, name } = this.props.currentUser;
    return (
      <View style={{ flex: 1 }}>
        {/* Header */}
        <ProgressiveImage
          hasOverlay
          style={styles.headerCoverImage}
          source={{ uri: (coverImage && getImgixCoverImage(coverImage)) || defaultCover }}
        >
          <View style={styles.userProfileContainer}>
            <FastImage
              style={styles.userProfileImage}
              source={{ uri: (avatar && avatar.medium) || defaultAvatar }}
              borderRadius={25}
            />
            <View style={styles.userProfileTextWrapper}>
              <Text style={styles.userProfileName}>{name}</Text>
            </View>
          </View>
        </ProgressiveImage>

        {/* View Profile */}
        <SidebarListItem
          style={styles.sidebarListItem}
          image={library}
          title="View Profile"
          onPress={this.onViewProfile}
        />

        {/* Account Settings */}
        {this.renderSectionHeader(this.accountSections)}
        {this.accountSections.data.map(item => (
          this.renderSectionItem(item)
        ))}

        {/* Logout */}
        <Button
          style={styles.logoutButton}
          title="Logout"
          icon="sign-out"
          onPress={this.onLogout}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ auth, user }) => ({
  accessToken: auth.tokens.access_token,
  currentUser: user.currentUser,
});

export default connect(mapStateToProps, { logoutUser })(SidebarScreen);
