import React, { PureComponent } from 'react';
import FastImage from 'react-native-fast-image';
import { View, Text, SectionList, Linking } from 'react-native';
import { connect } from 'react-redux';

import { logoutUser } from 'kitsu/store/auth/actions';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { getImgixCoverImage } from 'kitsu/utils/coverImage';
import defaultAvatar from 'kitsu/assets/img/default_avatar.png';
import defaultCover from 'kitsu/assets/img/default_cover.png';
import { library, settings, bugs, suggest, contact } from 'kitsu/assets/img/sidebar_icons';
import { extraDarkPurple } from 'kitsu/constants/colors';

import { SidebarListItem, SidebarTitle } from './common';
import { styles } from './styles';
import { Button } from 'kitsu/components/Button';

/*
const settingsData = [
  { title: 'Settings & Preferences', image: settings, target: 'Settings' },
  { title: 'Report Bugs', image: bugs, target: 'ReportBugs' },
  { title: 'Suggest Features', image: suggest, target: 'SuggestFeatures' },
  { title: 'Database Requests', image: suggest, target: 'DatabaseRequests' },
  { title: 'Contact Us', image: contact, target: 'mailto' },
];

const keyExtractor = (item, index) => index.toString();
*/

/*
class SidebarScreen extends React.Component {
  static navigationOptions = {
    header: null, // overlaps statusbar
  };

  state = {
    showAllGroups: false,
  };

  componentDidMount() {
    this.props.fetchGroupMemberships();
  }

  onLogoutButtonPressed = () => {
    this.props.logoutUser();
  };

  onSeeMoreButtonPressed = () => {
    this.setState({ showAllGroups: true });
  };

  navigateUserProfile = () => {
    if (this.props.userId) {
      this.props.navigation.navigate('ProfilePages', { userId: this.props.userId });
    }
  };

  renderSectionHeader = ({ section }) => (
    <SidebarTitle title={section.title} style={{ marginTop: 0 }} />
  );

  renderSectionFooter = ({ section }) => {
    const { groupMemberships } = this.props;
    if (
      section.key === 'groups' &&
      !this.state.showAllGroups &&
      groupMemberships &&
      groupMemberships.length > 3
    ) {
      return (
        <View style={{ marginBottom: 20 }}>
          <ItemSeparator underlineImage={false} />
          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.item, { paddingVertical: 8 }]}
            onPress={this.onSeeMoreButtonPressed}
          >
            <Text style={[styles.linkText, { marginLeft: 26 }]}>See More...</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return <View height={20} />;
  };

  renderListHeaderComponent = () => <View height={20} />;

  renderListFooterComponent = () => (
    <TouchableOpacity onPress={this.onLogoutButtonPressed} style={styles.logoutButton}>
      <Text style={[commonStyles.text, styles.logoutButtonText]}>Log Out</Text>
    </TouchableOpacity>
  );

  renderItemSeparatorComponent = () => <ItemSeparator />;

  renderSectionSeparatorComponent = () => null;

  render() {
    const { navigation, currentUser, groupMemberships, accessToken } = this.props;
    const { showAllGroups } = this.state;
    const { name, avatar, coverImage } = currentUser;
    const groupsData =
      (groupMemberships && (showAllGroups ? groupMemberships : groupMemberships.slice(0, 3))) || [];
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
    // Temporily disabled group display
    /**
    if (groupsData.length > 0) {
      sectionListData.splice(1, 0, {
        key: 'groups',
        data: groupsData,
        title: 'Groups',
        renderItem: ({ item }) => (
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
        ),
        ListEmptyComponent: () => <Text style={{ color: 'white' }}>Fetching Groups</Text>,
        ItemSeparatorComponent: () => <ItemSeparator underlineImage={false} />,
      });
    }

    return (
      <View style={{ backgroundColor: colors.listBackPurple, flex: 1 }}>
        <ProgressiveImage
          hasOverlay
          style={styles.headerCoverImage}
          source={{ uri: getImgixCoverImage(coverImage) || defaultCoverUri }}
          defaultSource={defaultCover}
        >
          <View
            style={{
              flex: 1,
              marginTop: Platform.select({ ios: 20, android: 24 }),
              paddingTop: isX ? paddingX : 0,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.userProfileButton}
              onPress={this.navigateUserProfile}
              disabled={isEmpty(currentUser)}
            >
              <FastImage
                style={styles.userProfileImage}
                source={(avatar && { uri: avatar.tiny }) || defaultAvatar}
                borderRadius={20}
              />
              <View style={styles.userProfileTextWrapper}>
                <Text style={styles.userProfileName}>{name || '-'}</Text>
                <Text style={styles.userProfileDetailsText}>view profile</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ProgressiveImage>
        <SectionList
          contentContainerStyle={{ paddingBottom: 100 }}
          sections={isEmpty(currentUser) ? [] : sectionListData}
          keyExtractor={keyExtractor}
          renderSectionHeader={this.renderSectionHeader}
          renderSectionFooter={this.renderSectionFooter}
          ListHeaderComponent={this.renderListHeaderComponent}
          ListFooterComponent={this.renderListFooterComponent}
          SectionSeparatorComponent={this.renderSectionSeparatorComponent}
          removeClippedSubviews={false}
        />
      </View>
    );
  }
}*/

class SidebarScreen extends PureComponent {
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
        Linking.openURL('mailto:josh@kitsu.io');
        break;
      default:
        break;
    }
  };

  onLogout = () => {
    this.props.logoutUser();
  };

  renderSectionHeader = (section) => (
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
          source={( coverImage && { uri: getImgixCoverImage(coverImage) }) || defaultCover }
        >
          <View style={styles.userProfileContainer}>
            <FastImage
              style={styles.userProfileImage}
              source={(avatar && { uri: avatar.tiny }) || defaultAvatar}
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
