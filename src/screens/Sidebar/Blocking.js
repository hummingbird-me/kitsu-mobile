import React from 'react';
import { View, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Text, Container, Content, Left, Right, Item, Spinner } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import menu from 'kitsu/assets/img/tabbar_icons/menu.png';
import { Kitsu, setToken } from 'kitsu/config/api';
import defaultAvatar from 'kitsu/assets/img/default_avatar.png';
import { SidebarHeader, SidebarTitle, ItemSeparator } from './common/';

class Blocking extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => <SidebarHeader navigation={navigation} headerTitle={'Blocking'} />,
    tabBarIcon: ({ tintColor }) => (
      <Image source={menu} style={{ tintColor, width: 20, height: 21 }} />
    ),
  });

  state = {
    loading: true,
    blocks: [],
    error: '',
  };

  componentDidMount() {
    this.fetchUserBlocks();
  }

  async onUnblockUser(user) {
    const token = this.props.accessToken;
    const { blocks } = this.state;
    const { id } = user;
    setToken(token);
    this.setState({ loading: true });
    try {
      await Kitsu.destroy('blocks', id);
      this.setState({
        blocks: blocks.filter(v => v.id !== id),
        loading: false,
      });
    } catch (e) {
      this.setState({
        error: e,
        loading: false,
      });
    }
  }

  fetchUserBlocks = async () => {
    const token = this.props.accessToken;
    const { id } = this.props.currentUser;
    setToken(token);
    try {
      const blocks = await Kitsu.findAll('blocks', {
        filter: { user: id },
        include: 'blocked',
      });
      this.setState({
        blocks,
        loading: false,
      });
    } catch (e) {
      this.setState({
        error: e,
        loading: false,
      });
    }
  };

  renderItem = ({ item }) => (
    <Item style={styles.sectionListItem}>
      <Left>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 25, alignItems: 'center' }}>
            <Image
              source={(item.blocked.avatar && { uri: item.blocked.avatar.small }) || defaultAvatar}
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
    const blocks = this.state.blocks;
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

const mapStateToProps = ({ auth, user }) => ({
  accessToken: auth.tokens.access_token,
  currentUser: user.currentUser,
});

Blocking.propTypes = {
  accessToken: PropTypes.string,
};

Blocking.defaultProps = {
  accessToken: null,
};

export default connect(mapStateToProps, {})(Blocking);
