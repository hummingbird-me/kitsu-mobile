import React from 'react';
import { View, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Text, Container, Content, Left, Right, Item, Spinner } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import menu from 'kitsu/assets/img/tabbar_icons/menu.png';
import { fetchUserBlocks } from 'kitsu/store/user/actions';

import { SidebarHeader, SidebarTitle, ItemSeparator } from './common/';

class Blocking extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => <SidebarHeader navigation={navigation} headerTitle={'Blocking'} />,
    tabBarIcon: ({ tintColor }) => (
      <Image source={menu} style={{ tintColor, width: 20, height: 21 }} />
    ),
  });

  componentDidMount() {
    this.props.fetchUserBlocks();
  }

  onUnblockUser = (user) => {
    // TODO: handle button press.
  };

  renderItem = ({ item }) => (
    <Item style={styles.sectionListItem}>
      <Left>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 25, alignItems: 'center' }}>
            <Image
              source={{ uri: item.blocked.avatar.small }}
              style={{ resizeMode: 'contain', width: 24, height: 24, borderRadius: 12 }}
            />
          </View>
          <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 8 }}>
            {item.blocked.name}
          </Text>
        </View>
      </Left>
      <Right>
        <TouchableOpacity
          onPress={() => this.onUnblockUser(item)}
          style={{
            backgroundColor: colors.darkGrey,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 6,
            borderRadius: 4,
          }}
        >
          <Text
            style={{ fontSize: 10, fontFamily: 'OpenSans', fontWeight: '600', color: colors.white }}
          >
            Unblock
          </Text>
        </TouchableOpacity>
      </Right>
    </Item>
  );

  render() {
    const blocks = this.props.blocks;
    return (
      <Container style={styles.containerStyle}>
        <Content scrollEnabled={false}>
          <View style={{ flex: 1, marginTop: 77 }}>
            <View
              style={{ backgroundColor: colors.white, padding: 2, borderRadius: 4, margin: 12 }}
            >
              <Text style={{ padding: 12, fontFamily: 'OpenSans', fontSize: 12 }}>
                Once you block someone, that person can no longer tag you, follow you, view your profile, or see the things you post in your feed. They basically stop existing.
              </Text>
              <ItemSeparator />
              <View
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
              >
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
              data={blocks}
              keyExtractor={item => item.blocked.id}
              renderItem={this.renderItem}
              ListEmptyComponent={() => <Spinner />}
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
    marginLeft: 0, // NATIVEBASE.
  },
};

const mapStateToProps = ({ user }) => ({
  blocks: user.currentUser.blocks || [],
});

Blocking.propTypes = {};

export default connect(mapStateToProps, { fetchUserBlocks })(Blocking);
