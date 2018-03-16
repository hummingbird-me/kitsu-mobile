import React from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Text,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { InstantSearch } from 'react-instantsearch/native';
import { connectInfiniteHits, connectSearchBox } from 'react-instantsearch/connectors';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { SearchBox } from 'kitsu/components/SearchBox';
import { Feedback } from 'kitsu/components/Feedback';
import { Kitsu, setToken } from 'kitsu/config/api';
import { kitsuConfig } from 'kitsu/config/env';
import defaultAvatar from 'kitsu/assets/img/default_avatar.png';
import { navigationOptions, SidebarTitle, ItemSeparator } from './common/';
import { styles } from './styles';

const RowItem = ({ type, item, onPress }) => {
  const buttonText = type === 'search' ? 'Block' : 'Unblock';
  return (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 25, alignItems: 'center' }}>
            <FastImage
              source={(item.avatar && { uri: item.avatar.small }) || defaultAvatar}
              style={{ resizeMode: 'contain', width: 24, height: 24 }}
              borderRadius={12}
            />
          </View>
          <Text
            style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 8, color: colors.softBlack }}
          >
            {item.name}
          </Text>
        </View>
      </View>
      <View>
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
      </View>
    </View>
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
      data={hits}
      keyboardShouldPersistTaps={'handled'}
      removeClippedSubviews={false}
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

const Hits = connectInfiniteHits(({ hits, hasMore, refine, onPress, currentUser }) => {
  const data = hits.filter(item => item.id != currentUser.id);
  return <BlockingResultList hits={data} hasMore={hasMore} refine={refine} onPress={onPress} />
});

const InstantSearchBox = connectSearchBox(
  ({ refine, currentRefinement, placeholder, searchIconOffset, style }) => (
    <SearchBox
      onChangeText={refine}
      value={currentRefinement}
      placeholder={placeholder}
      searchIconOffset={searchIconOffset}
      style={style}
    />
  ));

class Blocking extends React.Component {
  static navigationOptions = ({ navigation }) => navigationOptions(navigation, 'Blocking');

  state = {
    loading: true,
    blocks: [],
    totalBlocks: null,
    pageIndex: 1,
    pageLimit: 10,
    loadingMore: false,
    searchState: {},
    error: '',
  };

  componentDidMount() {
    this.fetchUserBlocks();
  }

  onError = (e) => {
    this.setState({
      error: (e && e[0] && e[0].title) || 'Something went wrong',
      loading: false,
      loadingMore: false,
    }, this.feedback.show);
  }

  onBlockUser = async (user) => {
    const { currentUser, accessToken } = this.props;
    const { id } = user;

    // Don't allow us to block ourselves!
    if (currentUser.id == user.id) return;

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
      this.onError(e);
    }
  };

  onUnblockUser = async (user) => {
    const { blocks } = this.state;
    const { id } = user;
    setToken(this.props.accessToken);
    this.setState({ loading: true });
    try {
      await Kitsu.destroy('blocks', id);
      this.setState({
        blocks: blocks.filter(v => v.id !== id),
        loading: false,
      });
    } catch (e) {
      this.onError(e);
    }
  };

  fetchUserBlocks = async () => {
    const { accessToken, currentUser } = this.props;
    setToken(accessToken);
    try {
      const blocks = await Kitsu.findAll('blocks', {
        filter: { user: currentUser.id },
        include: 'blocked',
      });
      this.setState({
        blocks,
        pageIndex: 1,
        totalBlocks: blocks.meta.count,
        loading: false,
      });
    } catch (e) {
      this.onError(e);
    }
  };

  loadMoreBlocks = async () => {
    const { loadingMore, pageLimit, pageIndex, totalBlocks } = this.state;
    const hasMore = totalBlocks / pageLimit > pageIndex;
    if (!loadingMore && hasMore) {
      const { accessToken, currentUser } = this.props;
      setToken(accessToken);
      this.setState({ loadingMore: true });
      try {
        const blocks = await Kitsu.findAll('blocks', {
          filter: { user: currentUser.id },
          include: 'blocked',
          page: {
            limit: pageLimit,
            offset: pageIndex * pageLimit,
          },
        });
        this.setState({
          loadingMore: false,
          blocks: this.state.blocks.concat(blocks),
          pageIndex: pageIndex + 1,
        });
      } catch (e) {
        this.onError(e);
      }
    }
  }

  handleSearchStateChange = (searchState) => {
    if (searchState.query === '') {
      this.setState({ searchState: {} });
    } else {
      this.setState({ searchState });
    }
  };

  renderResults = () => {
    const { query } = this.state.searchState;
    return (
      <View>
        {query && <Hits onPress={this.onBlockUser} currentUser={this.props.currentUser} />}
      </View>
    );
  };

  renderBlocksItem = ({ item }) => (
    <RowItem
      type={'flatlist'}
      item={item.blocked}
      onPress={() => this.onUnblockUser(item)}
    />
  );

  renderItemSeparatorComponent = () => (
    <ItemSeparator />
  );

  renderListEmptyComponent = () => (
    <Text style={styles.emptyText}>
      You aren{'\''}t currently blocking anyone.
    </Text>
  );

  render() {
    const { error, blocks, loading, searchState } = this.state;
    const { algoliaKeys } = this.props;
    const listTitle = blocks.length > 0 ? 'Blocked Users' : 'You aren\'t currently blocking any users.';
    return (
      <View style={styles.containerStyle}>
        <Feedback
          ref={(r) => this.feedback = r}
          title={error}
          containerStyle={{ top: 85 }}
        />
        <View style={styles.blockingWrapper}>
          <Text
            style={[styles.valueText, { padding: 12, paddingTop: 8, marginTop: 0 }]}
          >
            Once you block someone, that person can no longer tag you, follow you, view your profile, or see the things you post in your feed. They basically stop existing.
          </Text>
          <ItemSeparator />
          <InstantSearch
            appId={kitsuConfig.algoliaAppId}
            apiKey={algoliaKeys.users.key}
            indexName={algoliaKeys.users.index}
            searchState={searchState}
            onSearchStateChange={this.handleSearchStateChange}
          >
            <InstantSearchBox placeholder={'Search Users to Block'} searchIconOffset={160} />
            {this.renderResults()}
          </InstantSearch>
        </View>
        {loading
          ? <ActivityIndicator style={{ marginTop: 8 }} color={'white'} />
          :
          <View style={{ flex: 1 }}>
            <SidebarTitle title={listTitle} />
            <FlatList
              data={blocks}
              keyExtractor={item => item.blocked.id}
              renderItem={this.renderBlocksItem}
              ItemSeparatorComponent={this.renderItemSeparatorComponent}
              removeClippedSubviews={false}
              onEndReached={this.loadMoreBlocks}
              onEndReachedThreshold={0.3}
            />
          </View>}
      </View>
    );
  }
}

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
