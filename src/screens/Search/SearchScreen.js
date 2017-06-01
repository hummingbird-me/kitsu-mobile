import React, { Component } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Icon,
  Item,
  Input,
  Left,
  Right,
  Segment,
  Button,
  Text,
  StyleProvider,
} from 'native-base';
import PropTypes from 'prop-types';

import * as colors from '../../constants/colors';
import getTheme from '../../../native-base-theme/components';
import kitsuStyles from '../../../native-base-theme/variables/kitsu';
import { getDefaults } from '../../store/anime/actions';

const list = [
  { label: 'Release date', key: 'release' },
  { label: 'Genre', key: 'genre' },
  { label: 'Service', key: 'service' },
  { label: 'Highest rated', key: 'highestRated' },
  { label: 'Most anticipated', key: 'anticipated' },
  { label: 'Upcoming', key: 'upcoming' },
];

class SearchScreen extends Component {
  static navigationOptions = {
    title: 'Search',
    headerStyle: {
      backgroundColor: colors.darkPurple,
      shadowOpacity: 0,
      height: 50,
    },
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-search" android="md-search" style={{ fontSize: 24, color: tintColor }} />
    ),
  };

  constructor(props) {
    super(props);

    this.state = {
      active: 'Anime',
    };

    this.renderList = this.renderList.bind(this);
    this.renderGallery = this.renderGallery.bind(this);
  }

  componentDidMount() {
    this.props.getDefaults('topAiring');
    this.props.getDefaults('popular');
    this.props.getDefaults('highest');
    this.props.getDefaults('topUpcoming');
  }

  renderList() {
    return (
      <FlatList
        data={list}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <View
            button
            key={item.id}
            style={{
              height: 35,
              flexDirection: 'row',
              paddingLeft: 10,
              paddingRight: 10,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: '#EEEEEE',
            }}
            onPress={() => this.props.navigation.navigate('SearchCategory', item)}
          >
            <Left>
              <Text
                style={{
                  color: colors.darkGrey,
                  fontFamily: 'OpenSans',
                  fontSize: 13,
                  lineHeight: 18,
                  fontWeight: '600',
                }}
              >
                {item.label}
              </Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" style={{ fontSize: 17, color: colors.darkGrey }} />
            </Right>
          </View>
        )}
      />
    );
  }

  renderGallery(array, title, type) {
    let data = [];
    if (array.length > 0) {
      data = array.map(item => ({
        image: item.posterImage ? item.posterImage.medium : 'none',
        key: item.id,
      }));
    }
    return (
      <View style={{ paddingTop: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 40,
            paddingLeft: 10,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              lineHeight: 17,
              color: '#333333',
            }}
          >
            {title}
          </Text>
          <Button
            transparent
            style={{ height: 30, alignSelf: 'center', paddingRight: 10 }}
            onPress={() =>
              this.props.navigation.navigate('SearchResults', { label: title, default: type })}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'OpenSans',
                fontWeight: 'bold',
                color: '#969696',
              }}
            >
              View All
            </Text>
            <Icon
              name="arrow-forward"
              style={{
                fontSize: 16,
                fontFamily: 'OpenSans',
                fontWeight: '600',
                color: '#969696',
              }}
            />
          </Button>
        </View>
        {data.length > 0 &&
          <FlatList
            horizontal
            removeClippedSubviews={false}
            data={data}
            renderItem={({ item, index }) => (
              <View style={{ paddingRight: 5, marginLeft: index === 0 ? 10 : 0 }}>
                <Image source={{ uri: item.image }} style={{ height: 119, width: 80 }} />
              </View>
            )}
          />}
      </View>
    );
  }
  render() {
    const { animes } = this.props;
    const { active } = this.state;
    return (
      <Container>
        <StyleProvider style={getTheme(kitsuStyles)}>
          <Segment
            style={{
              backgroundColor: colors.darkPurple,
              borderTopWidth: 0,
              height: 44,
              shadowColor: 'black',
              shadowOpacity: 0.1,
              shadowRadius: StyleSheet.hairlineWidth,
            }}
          >
            <Button
              style={{ height: 28, marginTop: 0 }}
              active={active === 'Anime'}
              onPress={() => this.setState({ active: 'Anime' })}
              first
            >
              <Text>Anime</Text>
            </Button>
            <Button
              style={{ height: 28, marginTop: 0 }}
              onPress={() => this.setState({ active: 'Manga' })}
              active={active === 'Manga'}
            >
              <Text>Manga</Text>
            </Button>
            <Button
              style={{ height: 28, marginTop: 0 }}
              onPress={() => this.setState({ active: 'Users' })}
              active={active === 'Users'}
              last
            >
              <Text>Users</Text>
            </Button>
          </Segment>
        </StyleProvider>
        <Content style={{ backgroundColor: '#FAFAFA' }}>
          <Item
            style={{ height: 36, backgroundColor: '#FAFAFA', paddingLeft: 14, paddingRight: 14 }}
          >
            <Icon
              name="ios-search"
              style={{ color: '#9D9D9D', fontSize: 17, alignItems: 'center', marginTop: 5 }}
            />
            <Input
              placeholder="Search anime"
              style={{
                fontSize: 13,
                fontFamily: 'OpenSans',
                fontWeight: '600',
                color: colors.placeholderGrey,
                alignSelf: 'center',
              }}
              placeholderTextColor={colors.placeholderGrey}
            />
          </Item>
          {this.renderGallery(animes.topAiring, 'Top Airing Anime', 'topAiring')}
          {this.renderGallery(animes.topUpcoming, 'Top Upcoming Anime', 'topUpcoming')}
          {this.renderGallery(animes.highest, 'Highest Rated Anime', 'highest')}
          {this.renderGallery(animes.popular, 'Most Popular Anime', 'popular')}
          <View style={{ padding: 10, marginTop: 17 }}>
            <Text
              style={{
                color: colors.lightGrey,
                fontSize: 10,
                fontFamily: 'OpenSans',
                fontWeight: '600',
              }}
            >
              BROWSE BY
            </Text>
          </View>
          {this.renderList()}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ anime }) => {
  const {
    topAiring,
    topUpcoming,
    highest,
    popular,
    topAiringLoading,
    topUpcomingLoading,
    highestLoading,
    popularLoading,
  } = anime;
  return {
    animes: {
      topAiring,
      topUpcoming,
      highest,
      popular,
      topAiringLoading,
      topUpcomingLoading,
      highestLoading,
      popularLoading,
    },
  };
};

SearchScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { getDefaults })(SearchScreen);
