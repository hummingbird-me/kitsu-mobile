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
import Swipeable from 'react-native-swipeable';
import { connect } from 'react-redux';
import { Icon, Button, Container } from 'native-base';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import AweIcon from 'react-native-vector-icons/FontAwesome';

import SimpleTabBar from '../../components/SimpleTabBar';
import ProgressiveImage from '../../components/ProgressiveImage';

const { width } = Dimensions.get('window');
class LibraryScreen extends Component {
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
      color: 'white',
      isSwiping: false,
      leftActionActivated: false,
      toggle: false,
    };

    this.renderHeader = this.renderHeader.bind(this);
  }

  renderItem({ item, index }) {
    const leftContent = (
      <View
        style={{
          backgroundColor: this.state.color,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <Text style={{ color: 'white', padding: 30 }}>
          Pull to activate
        </Text>
      </View>
    );
    const rightButtons = [
      <TouchableHighlight><Text>Button 1</Text></TouchableHighlight>,
      <TouchableHighlight><Text>Button 2</Text></TouchableHighlight>,
    ];
    const { leftActionActivated, toggle } = this.state;
    return (
      <Swipeable
        rightButtons={rightButtons}
        onSwipeStart={() => this.setState({ isSwiping: true, color: 'red' })}
        onSwipeRelease={() => this.setState({ isSwiping: false })}
        // onSwipeMove={(aaa) => {
        //   const { color } = this.state;
        //   if (aaa.nativeEvent.pageX < 230 && this.state.leftActionActivated) {
        //     // this.setState({ color: 'red' });
        //     this.setState({ leftActionActivated: false });
        //   }
        //   if (aaa.nativeEvent.pageX > 230 && !this.state.leftActionActivated) {
        //     // this.setState({ color: 'green' });
        //     this.setState({ leftActionActivated: true });
        //   }
        // }}
        onLeftActionComplete={() => {
          console.log('Left Action Complete');
        }}
        leftActionActivationDistance={200}
        rightActionActivationDistance={200}
        leftContent={
          <View
            style={[
              styles.leftSwipeItem,
              { backgroundColor: leftActionActivated ? 'lightgoldenrodyellow' : 'steelblue' },
            ]}
          >
            {leftActionActivated ? <Text>release!</Text> : <Text>keep pulling!</Text>}
          </View>
        }
        rightContent={
          <View
            style={[
              styles.leftSwipeItem,
              { backgroundColor: leftActionActivated ? 'lightgoldenrodyellow' : 'steelblue' },
            ]}
          >
            {leftActionActivated ? <Text>release!</Text> : <Text>keep pulling!</Text>}
          </View>
        }
        // onLeftActionActivate={() => this.setState({ leftActionActivated: true })}
        // onLeftActionDeactivate={() => this.setState({ leftActionActivated: false })}
      >
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
              <Text
                style={{ fontSize: 12, fontFamily: 'OpenSans', color: 'rgba(97, 97, 97, 0.7)' }}
              >
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
      </Swipeable>
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
        shouldItemUpdate={(props, nextProps) => props.item !== nextProps.item}
        refreshing={false}
        scrollEnabled={!this.state.isSwiping}
        onRefresh={() => console.log('object')}
        ListHeaderComponent={() => this.renderHeader(type)}
        renderItem={e => this.renderItem(e)}
      />
    );
  }

  render() {
    const data = this.props.results.length > 0
      ? this.props.results
      : Array(20).fill(1).map((item, index) => ({ key: index }));
    return (
      <Container>
        <ScrollableTabView locked renderTabBar={() => <SimpleTabBar />}>
          <View tabLabel={`Following · ${24}`} style={{ paddingTop: 0, backgroundColor: 'white' }}>
            {this.renderTab(
              [
                { key: 21, val: 'aaa' },
                { key: 22, val: 'aaa' },
                { key: 23, val: 'aaa' },
                { key: 24, val: 'aaa' },
                { key: 25, val: 'aaa' },
                { key: 26, val: 'aaa' },
                { key: 27, val: 'aaa' },
                { key: 31, val: 'aaa' },
                { key: 32, val: 'aaa' },
                { key: 33, val: 'aaa' },
                { key: 34, val: 'aaa' },
                { key: 35, val: 'aaa' },
                { key: 36, val: 'aaa' },
                { key: 37, val: 'aaa' },
                { key: 40, val: 'aaa' },
                { key: 41, val: 'aaa' },
                { key: 42, val: 'aaa' },
                { key: 43, val: 'aaa' },
                { key: 44, val: 'aaa' },
                { key: 45, val: 'aaa' },
                { key: 46, val: 'aaa' },
                { key: 47, val: 'aaa' },
                { key: 48, val: 'aaa' },
                { key: 49, val: 'aaa' },
                { key: 50, val: 'aaa' },
                { key: 51, val: 'aaa' },
                { key: 52, val: 'aaa' },
                { key: 53, val: 'aaa' },
                { key: 54, val: 'aaa' },
                { key: 55, val: 'aaa' },
                { key: 56, val: 'aaa' },
                { key: 57, val: 'aaa' },
                { key: 58, val: 'aaa' },
                { key: 59, val: 'aaa' },
                { key: 60, val: 'aaa' },
                { key: 61, val: 'aaa' },
                { key: 62, val: 'aaa' },
                { key: 63, val: 'aaa' },
                { key: 64, val: 'aaa' },
                { key: 65, val: 'aaa' },
                { key: 66, val: 'aaa' },
                { key: 67, val: 'aaa' },
                { key: 68, val: 'aaa' },
                { key: 69, val: 'aaa' },
              ],
              'Following',
            )}
          </View>
          <View
            tabLabel={`Followers · ${79}`}
            style={{ padding: 5, paddingTop: 0, backgroundColor: 'white' }}
          >
            {this.renderTab(
              [
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
              ],
              'Followers',
            )}
          </View>
        </ScrollableTabView>
      </Container>
    );
  }
}

LibraryScreen.propTypes = {
  results: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = ({ anime }) => {
  const { resultsLoading } = anime;

  return { results: [], loading: resultsLoading };
};

const styles = {
  leftSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
};
export default connect(mapStateToProps)(LibraryScreen);
