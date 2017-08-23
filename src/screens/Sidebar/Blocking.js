import React from 'react';
import { View, Image, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Text, Container, Left, Right, Item, Spinner } from 'native-base';
import { InstantSearch } from 'react-instantsearch/native';
import { connectInfiniteHits } from 'react-instantsearch/connectors';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import SearchBox from 'kitsu/components/SearchBox';
import menu from 'kitsu/assets/img/tabbar_icons/menu.png';
import { Kitsu, setToken } from 'kitsu/config/api';
import { kitsuConfig } from 'kitsu/config/env';
import defaultAvatar from 'kitsu/assets/img/default_avatar.png';
import { SidebarHeader, SidebarTitle, ItemSeparator } from './common/';

const RowItem = ({ type, item, onPress }) => {
  const buttonText = type === 'search' ? 'Block' : 'Unblock';
  return (
    <Item style={styles.sectionListItem}>
      <Left>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 25, alignItems: 'center' }}>
            <Image
              source={(item.avatar && { uri: item.avatar.small }) || defaultAvatar}
              style={{ resizeMode: 'contain', width: 24, height: 24, borderRadius: 12 }}
            />
          </View>
          <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 8 }}>
            {item.name}
          </Text>
        </View>
      </Left>
      <Right>
        <TouchableOpacity
          onPress={() => onPress(item)}
          style={{
            backgroundColor: colors.darkGrey,
            height: 24,
            minWidth: 60,
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
            {buttonText}
          </Text>
        </TouchableOpacity>
      </Right>
    </Item>
  );
};

const BlockingResultList = ({ hits, hasMore, refine, onPress }) => {
  const onEndReached = () => {
    if (hasMore) {
      refine();
    }
  };
  return (
    <FlatList
      keyboardShouldPersistTaps={'handled'}
      removeClippedSubviews={false}
      data={hits}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      contentContainerStyle={styles.list}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <RowItem type={'search'} item={item} onPress={onPress} />}
      ItemSeparatorComponent={() => <ItemSeparator />}
      style={{ maxHeight: 200 }}
    />
  );
};

const Hits = connectInfiniteHits(({ hits, hasMore, refine, onPress }) => (
  <BlockingResultList hits={hits} hasMore={hasMore} refine={refine} onPress={onPress} />
));

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
    searchState: {},
    error: '',
  };

  componentDidMount() {
    this.fetchUserBlocks();
  }

  onBlockUser = async (user) => {
    const { currentUser, accessToken } = this.props;
    const { id } = user;
    setToken(accessToken);
    Keyboard.dismiss();
    this.setState({ loading: true, searchState: {} });
    try {
      await Kitsu.create('blocks', {
        blocked: { id },
        user: { id: currentUser.id },
      });
      this.fetchUserBlocks();
    } catch (e) {
      this.setState({
        error: e,
        loading: false,
      });
    }
  };

  onUnblockUser = async (user) => {
    const token = this.props.accessToken;
    const { blocks } = this.state;
    const { id } = user;
    setToken(token);
    this.setState({ loading: true });
    try {
      console.log('removing block of', user, ' with id ', id);
      await Kitsu.destroy('blocks', id);
      console.log('done');
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
  };

  fetchUserBlocks = async () => {
    const token = this.props.accessToken;
    const { id } = this.props.currentUser;
    setToken(token);
    try {
      const blocks = await Kitsu.findAll('blocks', {
        filter: { user: id },
        include: 'blocked',
      });
      console.log('success', blocks);
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

  handleSearchStateChange = (searchState) => {
    this.setState({ searchState });
  };

  renderResults = () => {
    const { query } = this.state.searchState;
    return (
      <View>
        {query && <Hits onPress={this.onBlockUser} />}
      </View>
    );
  };

  render() {
    const { blocks, loading } = this.state;
    return (
      <Container style={styles.containerStyle}>
        <View style={{ flex: 1, marginTop: 77 }}>
          <View style={{ backgroundColor: colors.white, padding: 2, borderRadius: 4, margin: 12 }}>
            <Text style={{ padding: 12, fontFamily: 'OpenSans', fontSize: 12 }}>
              Once you block someone, that person can no longer tag you, follow you, view your profile, or see the things you post in your feed. They basically stop existing.
            </Text>
            <ItemSeparator />
            <InstantSearch
              appId={kitsuConfig.algoliaAppId}
              apiKey={this.props.algoliaKeys.users.key}
              indexName={this.props.algoliaKeys.users.index}
              searchState={this.state.searchState}
              onSearchStateChange={this.handleSearchStateChange}
            >
              <SearchBox placeholder={'Search Users to Block'} />
              {this.renderResults()}
            </InstantSearch>
          </View>
          <SidebarTitle style={{ marginTop: 20 }} title={'Blocked Users'} />
          {!loading
            ? <FlatList
              data={blocks}
              keyExtractor={item => item.blocked.id}
              renderItem={({ item }) => (
                <RowItem
                  type={'flatlist'}
                  item={item.blocked}
                  onPress={() => this.onUnblockUser(item)}
                />
                )}
              ListEmptyComponent={() => <Spinner />}
              ItemSeparatorComponent={() => <ItemSeparator />}
              removeClippedSubviews={false}
            />
            : <Spinner color={'white'} />}
        </View>
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

const mapStateToProps = ({ app, auth, user }) => ({
  accessToken: auth.tokens.access_token,
  currentUser: user.currentUser,
  algoliaKeys: app.algoliaKeys,
});

Blocking.propTypes = {
  accessToken: PropTypes.string,
  currentUser: PropTypes.object,
};

Blocking.defaultProps = {
  accessToken: null,
  currentUser: {},
};

export default connect(mapStateToProps, {})(Blocking);
