import React, { Component } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Icon, Button } from 'native-base';
import * as colors from '../../constants/colors';
import { search } from '../../store/anime/actions';

class SearchResults extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.state.params.label,
    headerLeft: (
      <Button transparent color="white" onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" style={{ color: 'white' }} />
      </Button>
    ),
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-search" android="md-search" style={{ fontSize: 24, color: tintColor }} />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      index: 0,
    };

    this.loadMore = this.loadMore.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    if (params.default) {
      this.props.search({}, {}, this.state.index, params.default);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.results !== this.props.results) {
      this.setState({ loading: false });
    }
  }

  refresh() {
    const { params } = this.props.navigation.state;
    this.setState({ loading: true });
    if (params.default) {
      this.props.search({}, {}, 0, params.default);
    }
  }

  loadMore() {
    const { params } = this.props.navigation.state;
    this.props.search({}, {}, this.state.index + 1, params.default);
    this.setState({ index: this.state.index + 1 });
  }

  render() {
    return (
      <View>
        <FlatList
          removeClippedSubviews={false}
          data={this.props.results}
          onEndReached={() => this.loadMore()}
          onEndReachedThreshold={0.1}
          getItemLayout={(data, index) => ({
            length: 119,
            offset: 119 * index,
            index,
          })}
          initialNumToRender={10}
          numColumns={4}
          refreshing={this.state.loading}
          onRefresh={() => this.refresh()}
          contentContainerStyle={styles.list}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <Image
              source={{ uri: item.posterImage.medium }}
              style={{ height: 119, width: 80, margin: 3 }}
            />
          )}
        />
      </View>
    );
  }
}

const styles = {
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
};

const mapStateToProps = ({ anime }) => {
  const { results, loading } = anime;
  return { results, loading };
};
export default connect(mapStateToProps, { search })(SearchResults);
