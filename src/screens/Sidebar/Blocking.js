import React from 'react';
import { View, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Text, Container, Content, Left, Right, Item } from 'native-base';
import PropTypes from 'prop-types';
import SidebarHeader from './common/SidebarHeader';
import SidebarTitle from './common/SidebarTitle';
import SidebarListItem, { ItemSeparator } from './common/SidebarListItem';
import * as colors from '../../constants/colors';

import menu from '../../assets/img/tabbar_icons/menu.png';

class Blocking extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => <SidebarHeader navigation={navigation} headerTitle={'Blocking'} />,
    tabBarIcon: (
      { tintColor },
    ) => (
        <Image
          source={menu}
          style={{ tintColor, width: 20, height: 21 }}
        />
      ),
  });

  onUnblockUser = (user) => {

  }

  renderItem = ({ item }) => (
    <Item style={styles.sectionListItem}>
      <Left>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 25, alignItems: 'center' }}>
            <Image source={{ uri: item.user.photoURL }} style={{ resizeMode: 'contain', width: 24, height: 24, borderRadius: 12 }} />
          </View>
          <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 8 }}>
            {item.user.username}
          </Text>
        </View>
      </Left>
      <Right>
        <TouchableOpacity onPress={() => this.onUnblockUser(item)} style={{ backgroundColor: colors.darkGrey, height: 24, justifyContent: 'center', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 6, borderRadius: 4, }}>
          <Text style={{ fontSize: 10, fontFamily: 'OpenSans', fontWeight: '600', color: colors.white }}>Unblock</Text>
        </TouchableOpacity>
      </Right>
    </Item>
  )

  render() {
    const { navigation } = this.props;
    return ( // handle marginTop: 77
      <Container style={styles.containerStyle}>
        <Content scrollEnabled={false}>
          <View style={{ flex: 1, marginTop: 77 }}>
            <View style={{ backgroundColor: colors.white, padding: 2, borderRadius: 4, margin: 12 }}>
              <Text style={{ padding: 12, fontFamily: 'OpenSans', fontSize: 12 }}>Once you block someone, that person can no longer tag you, follow you, view your profile, or see the things you post in your feed. They basically stop existing.</Text>
              <ItemSeparator />
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TextInput
                  style={{ width: 300, height: 30, fontSize: 12, textAlign: 'center' }}
                  placeholder={'Search Users to Block'}
                  underlineColorAndroid={'transparent'}
                  keyboardAppearance={'dark'}
                />
              </View>
            </View>
            <SidebarTitle style={{ marginTop: 20 }} title={'Blocked Users'} />
            <FlatList
              data={[
                { user: { photoURL: 'https://fubukinofansub.files.wordpress.com/2011/12/cover-03-04.jpg', username: 'Nuck' } },
                { user: { photoURL: 'https://media.kitsu.io/groups/avatars/596/large.png?1490733214', username: 'MatthewDias' } },
                { user: { photoURL: 'https://media.kitsu.io/groups/avatars/91/large.gif?1424396944', username: 'Vevix' } },
              ]}
              keyExtractor={item => item.user.username}
              renderItem={this.renderItem}
              ItemSeparatorComponent={() => <ItemSeparator />}
              removeClippedSubviews={false}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = {
  containerStyle: { backgroundColor: colors.listBackPurple },
  sectionListItem: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 0,
    borderColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0,
    marginLeft: 0 // NATIVEBASE.
  },
};

const mapStateToProps = ({ user }) => {
  return {
  };
};

Blocking.propTypes = {
};

export default connect(mapStateToProps, {})(Blocking);
