import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Dimensions,
  FlatList,
  ListView,
  Text,
  TextInput,
  Image,
  Animated,
} from 'react-native';
import Swipeable from 'react-native-swipeable';
import { connect } from 'react-redux';
import { Icon, Button, Container } from 'native-base';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import AweIcon from 'react-native-vector-icons/FontAwesome';
import SimpleTabBar from 'kitsu/components/SimpleTabBar';

const { width } = Dimensions.get('window');

const data = [
  'row 1',
  'row 2',
  'row 3',
  'row 4',
  'row 5',
  'row 6',
  'row 7',
  'row 8',
  'row 9',
  'row 10',
  'row 11',
  'row 12',
  'row 13',
  'row 14',
  'row 15',
  'row 16',
  'row 17',
  'row 18',
  'row 19',
  'row 20',
];
class CustomLibScreen extends Component {
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
    this.items = [
      'row 1',
      'row 2',
      'row 3',
      'row 4',
      'row 5',
    ];
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => true });
    this.state = {
      loading: false,
      index: 0,
      val: '',
      color: 'white',
      isSwiping: false,
      leftActionActivated: false,
      toggle: false,
      data: this.ds.cloneWithRows(this.items),
    };

    this.renderHeader = this.renderHeader.bind(this);
    this.renderTab2 = this.renderTab2.bind(this);
    this.renderTab = this.renderTab.bind(this);
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
        renderItem={({ item, index }) => (
          <Example3
            key={item.key}
            item={item.key}
            onRemove={() => this.onRemove(index)}
            isSwiping={isSwiping => this.setState({ isSwiping })}
          />
        )}
      />
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

  onRemove(index) {
    console.log(this.items);
    this.items.splice(index, 1);
    console.log(this.items);
    this.setState({
      data: this.ds.cloneWithRows(this.items),
    });
  }

  renderTab2() {
    console.log(this.state.data);
    return (
      <ListView
        dataSource={this.state.data}
        scrollEnabled={!this.state.isSwiping}
        renderRow={(item, aa, index) => (
          <Example3
            key={item}
            item={item}
            onRemove={() => this.onRemove(index)}
            isSwiping={isSwiping => this.setState({ isSwiping })}
          />
        )}
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
            {this.renderTab2()}
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
              ],
              'Followers',
            )}
          </View>
        </ScrollableTabView>
      </Container>
    );
  }
}

CustomLibScreen.propTypes = {
  results: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = ({ anime }) => {
  const { resultsLoading } = anime;

  return { results: [], loading: resultsLoading };
};

const styles = {
  container: {
    flex: 1,
    paddingTop: 20,
  },
  listItem: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
  },
};
export default connect(mapStateToProps)(CustomLibScreen);

const ANIMATION_DURATION = 500;
class Example3 extends Component {
  state = {
    leftActionActivated: false,
    toggle: false,
  };

  constructor(props) {
    super(props);
    this.animated1 = new Animated.Value(1);
    this.animated2 = new Animated.Value(1);
    this.onRemove = this.onRemove.bind(this);
  }
  onRemove = () => {
    const { onRemove } = this.props;
    if (onRemove) {
      Animated.parallel([
        Animated.timing(this.animated1, {
          toValue: 0,
          duration: ANIMATION_DURATION,
        }),
        Animated.timing(this.animated2, {
          toValue: 0,
          duration: ANIMATION_DURATION / 2,
          delay: ANIMATION_DURATION / 2,
        }),
      ]).start(() => onRemove());
    }
  };
  render() {
    const { leftActionActivated, toggle } = this.state;
    const stl = {
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
    };
    const rowStyles = [
      {
        transform: [
          {
            translateX: this.animated1.interpolate({
              inputRange: [0, 1],
              outputRange: [width, 0],
              extrapolate: 'clamp',
            }),
          },
        ],
      },
      {
        height: this.animated2.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 76],
          extrapolate: 'clamp',
        }),
      },
      {
        opacity: this.animated2.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        }),
      },
    ];
    return (
      <Animated.View style={rowStyles}>
        <Swipeable
          onSwipeStart={() => this.props.isSwiping(true)}
          onSwipeRelease={() => {
            console.log('released');
            this.props.isSwiping(false);
          }}
          style={{ height: 76 }}
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
            this.onRemove();
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
          // rightContent={
          //   <View
          //     style={[
          //       styles.leftSwipeItem,
          //       { backgroundColor: leftActionActivated ? 'lightgoldenrodyellow' : 'steelblue' },
          //     ]}
          //   >
          //     {leftActionActivated ? <Text>release!</Text> : <Text>keep pulling!</Text>}
          //   </View>
          // }
          onLeftActionActivate={() => {
            console.log('onLeftActionActivate');
            this.setState({ leftActionActivated: true });
          }}
          onLeftActionDeactivate={() => {
            console.log('onLeftActionDeactivate');
            this.setState({ leftActionActivated: false });
          }}
        >
          <View style={stl}>
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
                  {this.props.item}
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
          </View>
        </Swipeable>
      </Animated.View>
    );
  }
}
