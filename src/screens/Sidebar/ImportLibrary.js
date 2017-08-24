import React from 'react';
import { View, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Text, Icon, Right, Item, Spinner } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { Kitsu, setToken } from 'kitsu/config/api';
import { success, failed, pending } from 'kitsu/assets/img/sidebar_icons/';
import { SidebarTitle, ItemSeparator, WidthFixer } from './common/';
import styles from './styles';

const MediaItem = ({ onPress, title, details, logoURL }) => (
  <Item onPress={onPress} button style={nativebaseStyles.sectionListItem}>
    <View style={{ justifyContent: 'center', marginLeft: 8 }}>
      <Image
        source={{ uri: logoURL }}
        style={{ width: 100, height: 24, resizeMode: 'contain', borderRadius: 12 }}
      />
      <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: colors.darkGrey }}>
        {details}
      </Text>
    </View>
    <Right>
      <Icon name={'ios-arrow-forward'} style={{ color: colors.lightGrey, fontSize: 16 }} />
    </Right>
  </Item>
);

const ImportItem = ({ kind, details, status, date }) => {
  let icon = null;
  const title = kind === 'my-anime-list' ? 'MyAnimeList' : 'AniList';
  switch (status) {
    case 'queued':
      icon = pending;
      break;
    case 'completed':
      icon = success;
      break;
    case 'failed':
      icon = failed;
      break;
    default:
      icon = 'pending';
  }
  return (
    <Item button style={nativebaseStyles.sectionListItem}>
      <View style={{ justifyContent: 'center', marginLeft: 8 }}>
        <Text style={{ fontWeight: '600', fontFamily: 'OpenSans', fontSize: 12 }}>
          {title}
        </Text>
        <Text style={{ fontFamily: 'OpenSans', fontSize: 10, color: colors.darkGrey }}>
          {details}
        </Text>
      </View>
      <Right>
        <WidthFixer>
          <Image
            source={icon}
            style={{ resizeMode: 'contain', width: 16, height: 16, borderRadius: 4 }}
          />
        </WidthFixer>
      </Right>
    </Item>
  );
};

class ImportLibrary extends React.Component {
  static navigationOptions = {
    title: 'Import Library',
  };

  state = {
    imports: [],
    loading: true,
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
      });
      this.setState({
        imports,
        loading: false,
      });
    } catch (e) {
      this.setState({
        error: e,
        loading: false,
      });
    }
  };

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
                logoURL: 'https://i2.wp.com/www.otakutale.com/wp-content/uploads/2015/07/MyAnimeList-Logo.jpg?resize=800%2C136',
                target: '',
              },
              {
                title: 'AniList',
                details: 'Import anime & manga library',
                logoURL: 'https://anilist.co/img/logo_anilist.png',
                target: '',
              },
            ]}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => (
              <MediaItem
                onPress={() => this.onMediaItemPressed(item)}
                logoURL={item.logoURL}
                title={item.title}
                details={item.details}
              />
            )}
            ItemSeparatorComponent={() => <ItemSeparator />}
            removeClippedSubviews={false}
          />
        </View>
        <SidebarTitle title={'Previous Imports'} />
        <FlatList
          data={imports}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => (
            <ImportItem
              kind={item.kind}
              details={'Some detail text will appear here.'}
              date={item.updatedDate}
              status={item.status}
            />
          )}
          ItemSeparatorComponent={() => <ItemSeparator />}
          removeClippedSubviews={false}
          ListEmptyComponent={<Spinner color={'white'} />}
        />
      </View>
    );
  }
}

const nativebaseStyles = {
  sectionListItem: {
    backgroundColor: colors.white,
    paddingHorizontal: 8,
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

ImportLibrary.propTypes = {};

export default connect(mapStateToProps, {})(ImportLibrary);
