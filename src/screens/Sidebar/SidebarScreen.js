import React, { Component } from 'react';
import { View, Image, SectionList, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Text, Spinner, Button, Container, Content, Icon, Left, Right, Item } from 'native-base';
import PropTypes from 'prop-types';
// import Icon from '../../components/Icon';
import * as colors from '../../constants/colors';
import menu from '../../assets/img/tabbar_icons/menu.png';
import defaultAvatar from '../../assets/img/default_avatar.png';
import poster from '../../assets/img/posters/avatar.jpg';

const shortcutsData = [
  { title: 'View Library', icon: 'md-book', target: '' },
];

const groupsData = [
  { title: 'Weekly Shonen Jump', imageURL: 'https://fubukinofansub.files.wordpress.com/2011/12/cover-03-04.jpg', target: '' },
  { title: 'Kitsu News Network', imageURL: 'https://media.kitsu.io/groups/avatars/596/large.png?1490733214', target: '' },
  { title: 'Food Fighters! (Cooking Club)', imageURL: 'https://media.kitsu.io/groups/avatars/91/large.gif?1424396944', target: '' }
];

const settingsData = [
  { title: 'Settings & Preferences', icon: 'ios-settings', target: '' },
  { title: 'Report Bug', icon: 'ios-bug', target: '' },
  { title: 'Suggest Features', icon: 'ios-megaphone', target: '' },
  { title: 'Contact Us', icon: 'md-mail-open', target: '' },
];

const LeftIconWrapper = ({children}) => (
  // have a standard width at all items.
  <View style={{ width: 25, alignItems: 'center' }}>
    {children}
  </View>
);

const SettingsItem = ({ icon, title, onPress }) => (
  <Item button onPress={onPress} style={styles.settingsItem}>
    <Left>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <LeftIconWrapper>
          <Icon name={icon} style={{ fontSize: 20 }} />
        </LeftIconWrapper>
        <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 8, color: '#444' }}>{title}</Text>
      </View>
    </Left>
    <Right>
      <Icon name={'ios-arrow-forward'} style={{ color: colors.lightGrey, fontSize: 16 }} />
    </Right>
  </Item>
);

const GroupsItem = ({ imageURL, title, onPress }) => (
  <Item button onPress={onPress} style={styles.settingsItem}>
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

const SectionTitle = ({ title }) => (
  <View style={{ paddingHorizontal: 2, paddingVertical: 8, backgroundColor: colors.listBackPurple }}>
    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 12, color: colors.white }}>{title}</Text>
  </View>
);

const ItemSeparator = () => (
  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.imageGrey}} />
);

class SidebarScreen extends Component {
  static navigationOptions = {
    tabBarIcon: (
      { tintColor },
    ) => (
      <Image
        source={menu}
        style={{ tintColor, width: 20, height: 21 }}
      />
    ),
  };

  state = {
    selectedImages: [],
  }

  render() {
    const { navigation } = this.props;
    const sectionListData = [
      {
        key: 'shortcuts',
        data: shortcutsData,
        title: 'Shortcuts',
        renderItem: ({ item }) => <SettingsItem onPress={()=>{}} title={item.title} icon={item.icon} />,
        ItemSeparatorComponent: () => <ItemSeparator />,
      },
      {
        key: 'groups',
        data: groupsData,
        title: 'Groups',
        renderItem: ({ item }) => <GroupsItem onPress={()=>{}} title={item.title} imageURL={item.imageURL} />,
        ItemSeparatorComponent: () => <ItemSeparator />,
      },
      {
        key: 'settings',
        data: settingsData,
        title: 'Account Settings',
        renderItem: ({ item }) => <SettingsItem onPress={()=>{}} title={item.title} icon={item.icon} />,
        ItemSeparatorComponent: () => <ItemSeparator />,
      },
    ];
    return (
      <Container style={styles.containerStyle}>
        <View style={{ paddingTop: Platform.select({ ios: 20, android: 24 }) }} scrollEnabled={false}>
          <Image style={{height: 80, justifyContent: 'center', padding: 20}} source={poster}>
            <View style={{flexDirection: 'row'}}>
              <Image style={{width:40, height: 40, borderRadius: 20}} source={defaultAvatar} />
              <View style={{marginLeft: 12, backgroundColor: 'transparent' }}>
                <Text style={{ fontFamily: 'OpenSans', color: colors.white, fontSize: 14, fontWeight: '600'}}>Dummy UI</Text>
                <Text style={{ fontFamily: 'OpenSans', color: colors.imageGrey, fontSize: 10}}>view profile</Text>
              </View>
            </View>
          </Image>
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
  settingsItem: {
    backgroundColor: colors.white,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0,
  },
};

const mapStateToProps = ({ user }) => {
  return {
  };
};

SidebarScreen.propTypes = {
};

export default connect(mapStateToProps, { })(SidebarScreen);
