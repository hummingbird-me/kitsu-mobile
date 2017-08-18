import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Platform, FlatList, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Text, Button, Container, Content, Spinner, Switch, Icon, Left, Right, Item } from 'native-base';
import PropTypes from 'prop-types';
import SidebarHeader from './common/SidebarHeader';
import SidebarTitle from './common/SidebarTitle';
import SidebarListItem, { ItemSeparator } from './common/SidebarListItem';
import * as colors from '../../constants/colors';

import menu from '../../assets/img/tabbar_icons/menu.png';

class LinkedAccounts extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => <SidebarHeader navigation={navigation} headerTitle={'Linked Accounts'} />,
    tabBarIcon: (
      { tintColor },
    ) => (
        <Image
          source={menu}
          style={{ tintColor, width: 20, height: 21 }}
        />
      ),
  });

  onUnlinkAccount = () => {

  }

  renderItem = ({ item }) => (
    <Item style={styles.sectionListItem}>
      <Left>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 90, alignItems: 'center' }}>
            <Image source={{ uri: item.logoURL }} style={{ resizeMode: 'contain', width: 90, height: 40 }} />
          </View>
        </View>
      </Left>
      <Right>
        <TouchableOpacity onPress={() => this.onUnlinkAccount(item)} style={{ backgroundColor: colors.darkGrey, height: 24, justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 8, borderRadius: 4 }}>
          <Text style={{ fontSize: 10, fontFamily: 'OpenSans', fontWeight: '600', color: colors.white }}>Disconnect</Text>
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
            <SidebarTitle style={{ marginTop: 20 }} title={'Social Accounts'} />
            <FlatList
              data={[
                { logoURL: 'https://www.famouslogos.us/images/facebook-logo.jpg' },
                { logoURL: 'https://www.maistecnologia.com/wp-content/uploads/2016/01/twitter-logo-2.png' },
              ]}
              keyExtractor={(item, index) => index}
              renderItem={this.renderItem}
              ItemSeparatorComponent={() => <ItemSeparator />}
              removeClippedSubviews={false}
              scrollEnabled={false}
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

LinkedAccounts.propTypes = {
};

export default connect(mapStateToProps, {})(LinkedAccounts);
