import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { Kitsu, setToken } from 'kitsu/config/api';
import { queued, success, failed, pending } from 'kitsu/assets/img/sidebar_icons/';
import myanimelist from 'kitsu/assets/img/myanimelist.png';
import anilist from 'kitsu/assets/img/anilist.png';
import { navigationOptions, SidebarTitle, ItemSeparator } from 'kitsu/screens/Sidebar/common/';
import { styles } from './styles';

const MediaItem = ({ onPress, title, details, image }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={1} style={styles.item}>
    <View style={{ justifyContent: 'center' }}>
      <FastImage source={image} style={styles.itemLogo} />
      <Text style={styles.hintText}>
        {details}
      </Text>
    </View>
    <View>
      <Icon name={'ios-arrow-forward'} style={{ color: colors.lightGrey, fontSize: 16 }} />
    </View>
  </TouchableOpacity>
);

const getTitleFromKind = (kind) => {
  switch (kind.toLowerCase()) {
    case 'my-anime-list':
      return 'MyAnimeList';
    case 'anilist':
      return 'AniList';
    case 'aozora':
      return 'Aozora';
    default:
      return 'Unknown';
  }
};

const ImportItem = ({ kind, status, date, total }) => {
  let icon = null;
  let details = '';
  const title = getTitleFromKind(kind);
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
        <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: colors.darkGrey }}>
          {details}
        </Text>
      </View>
      <View>
        <FastImage source={icon} style={[styles.itemImage, { right: -2 }]} />
      </View>
    </View>
  );
};

class ImportLibrary extends React.Component {
  static navigationOptions = ({ navigation }) => navigationOptions(navigation, 'Import Library');

  state = {
    imports: [],
    loading: true,
    totalImports: null,
    pageIndex: 1,
    pageLimit: 10,
    loadingMore: false,
  };

  componentDidMount() {
    this.fetchLibraryImports();
  }

  onMediaItemPressed = (item) => {
    const { navigation } = this.props;
    navigation.navigate('ImportDetail', { item });
  };

  fetchLibraryImports = async () => {
    const { accessToken, currentUser } = this.props;
    const { id } = currentUser;
    setToken(accessToken);
    try {
      const imports = await Kitsu.findAll('listImports', {
        filter: { user_id: id },
        page: { limit: 20 },
      });
      this.setState({
        imports,
        pageIndex: 1,
        totalImports: imports.meta.count,
        loading: false,
      });
    } catch (e) {
      this.setState({
        error: e,
        loading: false,
      });
    }
  };

  loadMoreImports = async () => {
    const { loadingMore, pageLimit, pageIndex, totalImports } = this.state;
    const hasMore = totalImports / pageLimit > pageIndex;
    if (!loadingMore && hasMore) {
      const { accessToken, currentUser } = this.props;
      const { id } = currentUser;
      setToken(accessToken);
      this.setState({ loadingMore: true });
      try {
        const imports = await Kitsu.findAll('listImports', {
          filter: { user_id: id },
          page: {
            limit: pageLimit,
            offset: pageIndex * pageLimit,
          },
        });
        this.setState({
          imports: this.state.imports.concat(imports),
          pageIndex: pageIndex + 1,
          loading: false,
          loadingMore: false,
        });
      } catch (e) {
        this.setState({
          error: e,
          loading: false,
          loadingMore: false,
        });
      }
    }
  }

  renderItemSeparatorComponent() {
    return (
      <ItemSeparator />
    );
  }

  render() {
    const { imports } = this.state;
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
            keyExtractor={(item, index) => index.toString()}
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
          keyExtractor={(item, index) => index.toString()}
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
          onEndReached={this.loadMoreImports}
          onEndReachedThreshold={0.3}
          // ListEmptyComponent={<ActivityIndicator color={'white'} />}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ auth, user }) => ({
  accessToken: auth.tokens.access_token,
  currentUser: user.currentUser,
});

ImportLibrary.propTypes = {};

export default connect(mapStateToProps, {})(ImportLibrary);
