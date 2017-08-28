import React from 'react';
import { View, Text, TextInput, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { Kitsu, setToken } from 'kitsu/config/api';
import { queued, success, failed, pending } from 'kitsu/assets/img/sidebar_icons/';
import myanimelist from 'kitsu/assets/img/myanimelist.png';
import anilist from 'kitsu/assets/img/anilist.png';
import { SidebarButton, SidebarTitle, ItemSeparator } from 'kitsu/screens/Sidebar/common/';
import { styles } from './styles';

const keyExtractor = (item, index) => index;

const MediaItem = ({ onPress, title, details, image }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={1} style={styles.item}>
    <View style={{ justifyContent: 'center' }}>
      <Image source={image} style={styles.itemLogo} />
      <Text style={styles.hintText}>
        {details}
      </Text>
    </View>
    <View>
      <Icon name={'ios-arrow-forward'} style={{ color: colors.lightGrey, fontSize: 16 }} />
    </View>
  </TouchableOpacity>
);

const ImportItem = ({ kind, status, date, total }) => {
  let icon = null;
  let details = '';
  const title = kind === 'my-anime-list' ? 'MyAnimeList' : 'AniList';
  switch (status) {
    case 'running':
      icon = pending;
      details = `Currently importing ${total} titles`;
      break;
    case 'queued':
      icon = queued;
      details = `Preparing to import ${total} titles`;
      break;
    case 'completed':
      icon = success;
      details = `Successfully imported ${total} titles`;
      break;
    case 'failed':
      icon = failed;
      details = `Failed to import ${total} titles. Try again later.`;
      break;
    default:
      icon = failed;
      details = `Failed to import ${total} titles. Try again later.`;
      break;
  }
  return (
    <View style={[styles.item, { paddingHorizontal: 12 }]}>
      <View style={{ justifyContent: 'center' }}>
        <Text style={{ fontWeight: '600', fontFamily: 'OpenSans', fontSize: 12 }}>
          {title}
        </Text>
        <Text style={styles.hintText}>
          {details}
        </Text>
      </View>
      <View>
        <Image source={icon} style={[styles.itemImage, { right: -2 }]} />
      </View>
    </View>
  );
};

class ExportLibrary extends React.Component {
  static navigationOptions = {
    title: 'MyAnimeList Sync',
  };

  state = {
    loading: false,
    hasAccount: false,
    linkedAccounts: [],
    username: '',
    password: '',
  }

  onSyncButtonPressed = async () => {
    const { accessToken, currentUser } = this.props;
    const { username, password } = this.state;
    const { id } = currentUser;
    setToken(accessToken);
    try {
      const linkedAccounts = await Kitsu.create('linkedAccounts', {
        externalUserId: username,
        token: password,
        kind: 'my-anime-list',
        syncTo: true,
        user: {
          id,
        },
      });
      this.setState({
        linkedAccounts,
        loading: false,
      });
    } catch (e) {
      this.setState({
        error: e,
        loading: false,
      });
    }
  }

  renderSetupScreen = () => {
    const { username, password, loading } = this.state;
    return (
      <View style={styles.containerStyle}>
        <View
          style={styles.card}
        >
          <View style={{ padding: 8 }}>
            <View style={{ alignItems: 'center' }}>
              <Image
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
              placeholder={`Your MyAnimeList Username`}
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
              placeholder={`Your MyAnimeList Password`}
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
          loading={loading}
        />
      </View>
    );
  }

  renderItemSeparatorComponent() {
    return <ItemSeparator />;
  }

  render() {
    const { imports, hasAccount } = this.state;
    if (!hasAccount) return this.renderSetupScreen();

    return (
      <View style={styles.containerStyle}>
        <View>
          <SidebarTitle title={'Import Media'} />
          <FlatList
            data={[
              {
                title: 'MyAnimeList',
                details: 'Import anime & manga library',
                image: myanimelist,
                target: '',
              },
              {
                title: 'AniList',
                details: 'Import anime & manga library',
                image: anilist,
                target: '',
              },
            ]}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => (
              <MediaItem
                onPress={() => this.onMediaItemPressed(item)}
                image={item.image}
                title={item.title}
                details={item.details}
              />
            )}
            ItemSeparatorComponent={this.renderItemSeparatorComponent}
            removeClippedSubviews={false}
          />
        </View>
        <SidebarTitle title={'Previous Imports'} />
        <FlatList
          data={imports}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => (
            <ImportItem
              total={item.total}
              kind={item.kind}
              date={item.updatedDate}
              status={item.status}
            />
          )}
          ItemSeparatorComponent={this.renderItemSeparatorComponent}
          removeClippedSubviews={false}
          ListEmptyComponent={<ActivityIndicator color={'white'} />}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ auth, user }) => ({
  accessToken: auth.tokens.access_token,
  currentUser: user.currentUser,
});

ExportLibrary.propTypes = {};

export default connect(mapStateToProps, {})(ExportLibrary);
