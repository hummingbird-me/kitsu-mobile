import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Dimensions, FlatList, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button, Container, Content } from 'native-base';
import AweIcon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

import SimpleTabBar from '../../components/SimpleTabBar';
import ProgressiveImage from '../../components/ProgressiveImage';
import ResultsList from '../../screens/Search/Lists/ResultsList';
import * as colors from '../../constants/colors';

class FavoriteMedia extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.label,
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
    };
  }

  renderItem({ item, index }, imageSize) {
    let height = Dimensions.get('window').width / 3;
    let width = Dimensions.get('window').width / 4 - 7;
    if (index < 2) {
      height = Dimensions.get('window').width / 1.5;
      width = Dimensions.get('window').width / 2 - 10;
    }
    return (
      <View
        style={{
          height,
          width,
          margin: 2,
        }}
      >
        <ProgressiveImage
          source={{ uri: item.image }}
          style={{
            height,
            width,
          }}
        />
      </View>
    );
  }

  renderTab(data) {
    return (
      <FlatList
        removeClippedSubviews={false}
        data={data}
        numColumns={4}
        refreshing={false}
        onRefresh={() => console.log('object')}
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
        <ScrollableTabView renderTabBar={() => <SimpleTabBar />}>
          <View tabLabel="Anime" style={{ padding: 5, paddingTop: 0, backgroundColor: 'white' }}>
            {this.renderTab([
              { key: 1, val: 'aaa' },
              { key: 2, val: 'aaa' },
              { key: '1', val: 'aaa' },
              { key: '2', val: 'aaa' },
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
              { key: 19, val: 'aaa' },
              { key: 20, val: 'aaa' },
            ])}
          </View>
          <View tabLabel="Manga" style={{ padding: 5, paddingTop: 0, backgroundColor: 'white' }}>
            {this.renderTab([
              { key: 1, val: 'aaa' },
              { key: 2, val: 'aaa' },
              { key: '1', val: 'aaa' },
              { key: '2', val: 'aaa' },
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
              { key: 19, val: 'aaa' },
              { key: 20, val: 'aaa' },
            ])}
          </View>
        </ScrollableTabView>
      </Container>
    );
  }
}

FavoriteMedia.propTypes = {
  results: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = ({ anime }, ownProps) => {
  const { resultsLoading } = anime;
  const { navigation: { state: { params: { active } } } } = ownProps;

  return { results: [], loading: resultsLoading };
};
export default connect(mapStateToProps)(FavoriteMedia);
