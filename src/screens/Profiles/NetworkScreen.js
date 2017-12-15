import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Dimensions,
  FlatList,
  Text,
  TextInput,
  Image,
  TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button, Container, Spinner } from 'native-base';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import AweIcon from 'react-native-vector-icons/FontAwesome';
import { ScrollableTabBar } from 'kitsu/components/ScrollableTabBar';
import { fetchNetwork } from 'kitsu/store/profile/actions';
import { defaultAvatar } from 'kitsu/constants/app';
import { NavigationHeader } from 'kitsu/components/NavigationHeader';

const renderTabBar = () => <ScrollableTabBar />;

const { width } = Dimensions.get('window');
class NetworkScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <NavigationHeader
        navigation={navigation}
        title={`${navigation.state.params.name}'s Network`}
      />
    ),
  });

  state = {
    follower: 0,
    followed: 0,
  }

  componentDidMount() {
    const { userId } = this.props.navigation.state.params;
    this.props.fetchNetwork(userId, 'followed');
    this.props.fetchNetwork(userId, 'follower');
  }

  renderItem = ({ item, index }, type) => {
    const { ifollow, currentUser } = this.props;
    const a = type === 'Following' ? 'followed' : 'follower';
    if (!item[a]) return <View style={styles.itemStyle}><Spinner size="small" /></View>;
    return (
      <TouchableHighlight
        onPress={() => this.props.navigation.navigate('UserProfile', { userName: item[a].name })}
      >
        <View style={styles.itemStyle}>
          <View style={{ paddingRight: 10 }}>
            <Image
              style={{ width: 60, height: 60, borderRadius: 30 }}
              source={{
                uri: item[a].avatar ? item[a].avatar.medium : defaultAvatar,
              }}
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '600' }}>
                {item[a].name}
              </Text>
            </View>
            <View style={{ justifyContent: 'flex-start' }}>
              <Text
                style={{ fontSize: 12, fontFamily: 'OpenSans', color: 'rgba(97, 97, 97, 0.7)' }}
              >
                {item[a].followersCount} followers
              </Text>
            </View>
          </View>
          <View style={{ justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
            {currentUser.id !== item[a].id &&
              <Button
                style={{
                  height: 27,
                  width: 94,
                  alignSelf: 'center',
                  backgroundColor: ifollow[item[a].id] ? '#878787' : '#16A085',
                  justifyContent: 'center',
                  borderRadius: 0,
                }}
                small
                success
              >
                <Text style={{ color: 'white', fontSize: 11 }}>
                  {ifollow[item[a].id] ? 'Unfollow' : 'Follow'}
                </Text>
              </Button>}
            <Button transparent style={{ paddingLeft: 12 }}>
              <AweIcon
                name="ellipsis-v"
                style={{
                  color: '#989898',
                  fontSize: 18,
                }}
              />
            </Button>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderHeader = (type) => {
    return (
      <View
        style={{ height: 47, backgroundColor: '#EEEEEE', justifyContent: 'center', padding: 9 }}
      >
        <AweIcon
          name="search"
          style={{
            position: 'absolute',
            left: width / 2 - 60,
            zIndex: 1,
            color: '#989898',
            backgroundColor: 'white',
            fontSize: 11,
          }}
        />
        <TextInput
          value={this.state.val}
          onChangeText={text => this.setState({ val: text })}
          placeholder={`Search ${type}`}
          placeholderTextColor="#989898"
          style={{
            backgroundColor: 'white',
            flex: 1,
            height: 29,
            textAlign: 'center',
            borderRadius: 3,
            fontSize: 11,
            fontFamily: 'OpenSans',
          }}
        />
      </View>
    );
  }

  loadMore = (dat) => {
    const type = dat === 'Following' ? 'followed' : 'follower';
    const { userId } = this.props.navigation.state.params;
    if (!this.props.networkLoading[type]) {
      this.props.fetchNetwork(userId, type, 20, this.state[type] + 1);
      this.setState({ [type]: this.state[type] + 1 });
    }
  }

  renderFooter = (dat) => {
    const { networkLoading } = this.props;
    const type = dat === 'Following' ? 'followed' : 'follower';
    if (this.state[type] > 0 && networkLoading[type]) {
      return <Spinner size="small" color="grey" />;
    }
    return null;
  }

  renderTab = (data, type) => {
    return (
      <FlatList
        removeClippedSubviews={false}
        data={data}
        keyExtractor={item => item.id}
        refreshing={false}
        onRefresh={() => console.log('object')}
        ListHeaderComponent={() => this.renderHeader(type)}
        ListFooterComponent={() => this.renderFooter(type)}
        renderItem={e => this.renderItem(e, type)}
        onEndReached={() => this.loadMore(type)}
        onEndReachedThreshold={0.5}
      />
    );
  }

  render() {
    const { userId } = this.props.navigation.state.params;
    const { followed, follower, profile, networkLoading } = this.props;
    return (
      <Container>
        <ScrollableTabView renderTabBar={renderTabBar}>
          <View
            tabLabel={`Following · ${profile.followingCount}`}
            style={{ paddingTop: 0, backgroundColor: 'white' }}
          >
            {networkLoading.followed && this.state.followed === 0
              ? <Spinner color="grey" size="small" />
              : this.renderTab(followed[userId], 'Following')}
          </View>
          <View
            tabLabel={`Followers · ${profile.followersCount}`}
            style={{ padding: 5, paddingTop: 0, backgroundColor: 'white' }}
          >
            {networkLoading.follower && this.state.follower === 0
              ? <Spinner color="grey" size="small" />
              : this.renderTab(follower[userId], 'Followers')}
          </View>
        </ScrollableTabView>
      </Container>
    );
  }
}

NetworkScreen.propTypes = {
  followed: PropTypes.object.isRequired,
  follower: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  networkLoading: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { followed, follower, profile, networkLoading } = state.profile;
  const { ifollow, currentUser } = state.user;
  const userId = ownProps.navigation.state.params && ownProps.navigation.state.params.userId;
  // console.log(userId);
  // console.log(profile);

  return { followed, follower, ifollow, profile: profile[userId], currentUser, networkLoading };
};

const styles = {
  itemStyle: {
    height: 76,
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingRight: 0,
  },
};
export default connect(mapStateToProps, { fetchNetwork })(NetworkScreen);
