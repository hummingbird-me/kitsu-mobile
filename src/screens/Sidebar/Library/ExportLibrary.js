import React from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { Kitsu, setToken } from 'kitsu/config/api';
import { queued, success, failed, pending } from 'kitsu/assets/img/sidebar_icons/';
import myanimelist from 'kitsu/assets/img/myanimelist.png';
import defaultAvatar from 'kitsu/assets/img/default_avatar.png';
import { navigationOptions, SidebarButton, SidebarTitle, ItemSeparator } from 'kitsu/screens/Sidebar/common/';
import { styles } from './styles';

const keyExtractor = (item, index) => index.toString();

const ExportItem = ({ canonicalTitle, posterImage, syncStatus }) => {
  let icon = null;
  let details = '';
  switch (syncStatus) {
    case 'pending':
      icon = pending;
      details = 'Currently Updating MAL Entry';
      break;
    case 'success':
      icon = success;
      details = 'Successfully Created MAL Entry';
      break;
    case 'error':
      icon = failed;
      details = 'Failed to Update MAL Entry';
      break;
    default:
      icon = failed;
      details = 'Failed to Update MAL Entry';
      break;
  }
  return (
    <View style={[styles.item, { paddingHorizontal: 12 }]}>
      <FastImage
        style={{ width: 30, height: 30 }}
        source={(posterImage && { uri: posterImage.small || posterImage.large }) || defaultAvatar}
      />
      <View style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 12, justifyContent: 'center' }}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={{ fontWeight: '600', fontFamily: 'OpenSans', fontSize: 12 }}
          >
            {canonicalTitle}
          </Text>
          <Text style={styles.hintText}>
            {details}
          </Text>
        </View>
      </View>
      <View>
        <FastImage source={icon} style={[styles.itemImage, { right: -2 }]} />
      </View>
    </View>
  );
};

class ExportLibrary extends React.Component {
  static navigationOptions = ({ navigation }) => navigationOptions(navigation, 'MyAnimeList Sync');

  state = {
    loading: true,
    authenticating: false,
    hasAccount: false,
    linkedAccount: {},
    libraryEntryLogs: [],
    totalEntryLogs: null,
    pageIndex: 1,
    pageLimit: 10,
    loadingMore: false,
    username: '',
    password: '',
  }

  componentDidMount() {
    this.fetchLinkedAccounts();
  }

  onSyncButtonPressed = async () => {
    const { accessToken, currentUser } = this.props;
    const { username, password } = this.state;
    const { id } = currentUser;
    setToken(accessToken);
    this.setState({ authenticating: true });
    try {
      const linkedAccount = await Kitsu.create('linkedAccounts', {
        externalUserId: username,
        token: password,
        kind: 'my-anime-list',
        syncTo: true,
        user: {
          id,
        },
      });
      this.setState({
        linkedAccount,
        authenticating: false,
        hasAccount: true,
        username: '',
        password: '',
      });
    } catch (e) {
      this.setState({
        error: e,
        authenticating: false,
      });
    }
  }

  onDisconnectButtonPressed = async () => {
    const { accessToken } = this.props;
    const { linkedAccount } = this.state;
    setToken(accessToken);
    this.setState({ loading: true });
    try {
      await Kitsu.destroy('linkedAccounts', linkedAccount.id);
      this.setState({
        hasAccount: false,
        loading: false,
      });
    } catch (e) {
      this.setState({
        error: e,
        loading: false,
      });
    }
  }

  fetchLinkedAccounts = async () => {
    const { accessToken, currentUser } = this.props;
    const { id } = currentUser;
    setToken(accessToken);
    try {
      const linkedAccounts = await Kitsu.findAll('linkedAccounts', {
        user: { id },
        filter: { kind: 'my-anime-list' },
      });
      const hasAccount = typeof linkedAccounts[0] !== 'undefined';
      // show form if user has no linked accounts. else, load the data and fetch
      // entry logs.
      this.setState({
        linkedAccount: linkedAccounts[0],
        loading: hasAccount,
        hasAccount,
      }, () => {
        if (hasAccount) {
          this.fetchLibraryEntryLogs();
        }
      });
    } catch (e) {
      this.setState({
        error: e,
        loading: false,
        hasAccount: false,
      });
    }
  }

  fetchLibraryEntryLogs = async () => {
    const { accessToken } = this.props;
    const { linkedAccount, pageLimit } = this.state;
    setToken(accessToken);
    // console.log(accessToken, linkedAccount);
    try {
      const libraryEntryLogs = await Kitsu.findAll('libraryEntryLogs', {
        filter: { linked_account_id: linkedAccount.id },
        fields: { media: 'canonicalTitle,titles,posterImage,slug' },
        page: { limit: pageLimit },
        sort: '-created_at',
        include: 'media',
      });
      this.setState({
        libraryEntryLogs,
        totalEntryLogs: libraryEntryLogs.meta.count,
        loading: false,
        pageIndex: 1,
        hasAccount: true,
      });
    } catch (e) {
      this.setState({
        error: e,
        loading: false,
        hasAccount: false,
      });
    }
  }

  loadMoreEntryLogs = async () => {
    const { loadingMore, pageLimit, pageIndex, totalEntryLogs, linkedAccount } = this.state;
    const hasMore = totalEntryLogs / pageLimit > pageIndex;
    if (!loadingMore && hasMore) {
      const { accessToken, currentUser } = this.props;
      const { id } = currentUser;
      setToken(accessToken);
      this.setState({ loadingMore: true });
      try {
        const libraryEntryLogs = await Kitsu.findAll('libraryEntryLogs', {
          filter: { linked_account_id: linkedAccount.id },
          fields: { media: 'canonicalTitle,titles,posterImage,slug' },
          page: {
            limit: pageLimit,
            offset: pageLimit * pageIndex,
          },
          sort: '-created_at',
          include: 'media',
        });
        this.setState({
          libraryEntryLogs: this.state.libraryEntryLogs.concat(libraryEntryLogs),
          loading: false,
          loadingMore: false,
          pageIndex: pageIndex + 1,
          hasAccount: true,
        });
      } catch (e) {
        this.setState({
          error: e,
          loading: false,
          loadingMore: false,
          hasAccount: false,
        });
      }
    }
  }

  renderSetupScreen = () => {
    const { username, password, authenticating } = this.state;
    return (
      <View style={styles.containerStyle}>
        <View
          style={styles.card}
        >
          <View style={{ padding: 8 }}>
            <View style={{ alignItems: 'center' }}>
              <FastImage
                source={myanimelist}
                style={styles.cardLogo}
              />
            </View>
            <Text
              style={styles.cardText}
            >
              Enter your username below to connect your MAL account to your Kitsu account. All future updates will be synced.
            </Text>
          </View>
          <ItemSeparator />
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={t => this.setState({ username: t })}
              placeholder={'Your MyAnimeList Username'}
              underlineColorAndroid={'transparent'}
              autoCapitalize={'none'}
              keyboardAppearance={'dark'}
            />
          </View>
          <ItemSeparator />
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={t => this.setState({ password: t })}
              placeholder={'Your MyAnimeList Password'}
              secureTextEntry
              underlineColorAndroid={'transparent'}
              autoCapitalize={'none'}
              keyboardAppearance={'dark'}
            />
          </View>
        </View>
        <SidebarButton
          style={{ marginTop: 0, paddingHorizontal: 12 }}
          disabled={username.length === 0}
          onPress={this.onSyncButtonPressed}
          title={`Connect MAL Account`}
          loading={authenticating}
        />
      </View>
    );
  }

  renderItemSeparatorComponent() {
    return <ItemSeparator />;
  }

  renderLoadingIndicator() {
    return (
      <View style={[styles.containerStyle, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  render() {
    const { loading, linkedAccount, libraryEntryLogs, hasAccount } = this.state;
    if (loading) return this.renderLoadingIndicator();
    if (!hasAccount) return this.renderSetupScreen();

    return (
      <View style={styles.containerStyle}>
        <View style={[styles.card, { flexDirection: 'row', padding: 8, alignItems: 'center', justifyContent: 'space-between' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }} >
            <FastImage source={pending} style={{ width: 30, height: 30 }} />
            <Text style={{ marginLeft: 8, fontFamily: 'OpenSans', fontWeight: '500' }}>{linkedAccount.externalUserId}</Text>
          </View>
          <TouchableOpacity onPress={this.onDisconnectButtonPressed} style={{}}>
            <FastImage source={failed} style={{ width: 16, height: 16 }} />
          </TouchableOpacity>
        </View>
        <SidebarTitle title={'Entries'} />
        <FlatList
          data={libraryEntryLogs}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => {
            const { canonicalTitle, posterImage } = item.media;
            return (
              <ExportItem
                canonicalTitle={canonicalTitle}
                posterImage={posterImage}
                syncStatus={item.syncStatus}
              />
            );
          }}
          ItemSeparatorComponent={this.renderItemSeparatorComponent}
          removeClippedSubviews={false}
          onEndReached={this.loadMoreEntryLogs}
          onEndReachedThreshold={0.3}
          // ListEmptyComponent={<Text> No Library exports </Text>}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ auth, user }) => ({
  accessToken: auth.tokens.access_token,
  currentUser: user.currentUser,
});

export default connect(mapStateToProps, {})(ExportLibrary);
