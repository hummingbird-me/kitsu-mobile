import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, FlatList, Text, TextInput, Image } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button, Container } from 'native-base';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import AweIcon from 'react-native-vector-icons/FontAwesome';

import SimpleTabBar from '../../components/SimpleTabBar';

const { width } = Dimensions.get('window');
class NetworkScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Rob's Network",
    headerLeft: (
      <Button transparent color="white" onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" style={{ color: 'white' }} />
      </Button>
    ),
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-body" android="md-body" style={{ fontSize: 24, color: tintColor }} />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      index: 0,
      val: '',
    };

    this.renderHeader = this.renderHeader.bind(this);
  }

  renderItem({ item, index }) {
    return (
      <View
        style={{
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
        }}
      >
        <View style={{ paddingRight: 10 }}>
          <Image
            style={{ width: 60, height: 60, borderRadius: 30 }}
            source={{
              uri: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
            }}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '600' }}>
              Akidearest
            </Text>
          </View>
          <View style={{ justifyContent: 'flex-start' }}>
            <Text style={{ fontSize: 12, fontFamily: 'OpenSans', color: 'rgba(97, 97, 97, 0.7)' }}>
              89 followers
            </Text>
          </View>
        </View>
        <View style={{ justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
          {index % 2 === 0 &&
            <Button
              style={{
                height: 27,
                width: 94,
                alignSelf: 'center',
                backgroundColor: '#16A085',
                justifyContent: 'center',
                borderRadius: 0,
              }}
              small
              success
            >
              <Text style={{ color: 'white', fontSize: 11 }}>Follow</Text>
            </Button>}
          {index % 2 === 1 &&
            <Button
              style={{
                height: 27,
                width: 94,
                alignSelf: 'center',
                backgroundColor: '#878787',
                justifyContent: 'center',
                borderRadius: 0,
              }}
              small
              success
            >
              <Text style={{ color: 'white', fontSize: 11 }}>Unfollow</Text>
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
    );
  }

  renderHeader(type) {
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

  renderTab(data, type) {
    return (
      <FlatList
        removeClippedSubviews={false}
        data={data}
        refreshing={false}
        onRefresh={() => console.log('object')}
        ListHeaderComponent={() => this.renderHeader(type)}
        renderItem={e => this.renderItem(e)}
      />
    );
  }

  render() {
    return (
      <Container>
        <ScrollableTabView renderTabBar={() => <SimpleTabBar />}>
          <View tabLabel={`Following · ${24}`} style={{ paddingTop: 0, backgroundColor: 'white' }}>
            {this.renderTab([
              { key: 1, val: 'aaa' },
              { key: 2, val: 'aaa' },
              { key: 3, val: 'aaa' },
              { key: 4, val: 'aaa' },
              { key: 5, val: 'aaa' },
              { key: 6, val: 'aaa' },
              { key: 7, val: 'aaa' },
              { key: 8, val: 'aaa' },
              { key: 13, val: 'aaa' },
              { key: 14, val: 'aaa' },
              { key: 15, val: 'aaa' },
              { key: 16, val: 'aaa' },
              { key: 17, val: 'aaa' },
              { key: 18, val: 'aaa' },
              { key: 19, val: 'aaa' },
              { key: 20, val: 'aaa' },
              { key: 29, val: 'aaa' },
              { key: 30, val: 'aaa' },
            ], 'Following')}
          </View>
          <View
            tabLabel={`Followers · ${79}`}
            style={{ padding: 5, paddingTop: 0, backgroundColor: 'white' }}
          >
            {this.renderTab([
              { key: 21, val: 'aaa' },
              { key: 22, val: 'aaa' },
              { key: 23, val: 'aaa' },
              { key: 24, val: 'aaa' },
              { key: 25, val: 'aaa' },
              { key: 26, val: 'aaa' },
              { key: 27, val: 'aaa' },
              { key: 28, val: 'aaa' },
              { key: 213, val: 'aaa' },
              { key: 214, val: 'aaa' },
              { key: 215, val: 'aaa' },
              { key: 216, val: 'aaa' },
              { key: 217, val: 'aaa' },
              { key: 218, val: 'aaa' },
              { key: 219, val: 'aaa' },
              { key: 220, val: 'aaa' },
              { key: 229, val: 'aaa' },
              { key: 230, val: 'aaa' },
            ], 'Followers')}
          </View>
        </ScrollableTabView>
      </Container>
    );
  }
}

NetworkScreen.propTypes = {
  results: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = ({ anime }) => {
  const { resultsLoading } = anime;

  return { results: [], loading: resultsLoading };
};
export default connect(mapStateToProps)(NetworkScreen);
