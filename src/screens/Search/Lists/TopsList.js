import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Left, Right, Button, Text, Item } from 'native-base';
import PropTypes from 'prop-types';
import _ from 'lodash';

import * as colors from '../../../constants/colors';
import { getDefaults } from '../../../store/anime/actions';
import ProgressiveImage from '../../../components/ProgressiveImage';

const list = [
  { label: 'Release date', key: 'release' },
  { label: 'Category', key: 'categories', title: 'Select Categories' },
  { label: 'Streaming Service', key: 'service' },
];

class TopsList extends Component {
  constructor(props) {
    super(props);

    this.renderList = this.renderList.bind(this);
    this.renderGallery = this.renderGallery.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    this.init(this.props.active);
  }

  init(type) {
    this.props.getDefaults('topAiring', type);
    this.props.getDefaults('popular', type);
    this.props.getDefaults('highest', type);
    this.props.getDefaults('topUpcoming', type);
  }

  renderList() {
    const { active } = this.props;
    return (
      <FlatList
        data={list}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <Item
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
            onPress={() => this.props.navigation.navigate('SearchCategory', { ...item, active })}
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
          </Item>
        )}
      />
    );
  }

  renderGallery(array, title, type) {
    let data = Array(10).fill(1).map((item, index) => ({ key: index }));
    const { active } = this.props;
    if (array.length > 0) {
      data = array.map(item => ({
        image: item.posterImage ? item.posterImage.small : 'none',
        key: item.id,
        id: item.id,
        type: item.type,
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
              this.props.navigation.navigate('SearchResults', {
                label: title,
                default: type,
                active,
              })}
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
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Media', {
                    mediaId: item.id,
                    type: item.type,
                  });
                }}
                style={{ paddingRight: 5, marginLeft: index === 0 ? 10 : 0 }}
              >
                <ProgressiveImage
                  source={{ uri: item.image }}
                  containerStyle={{
                    height: 119,
                    width: 80,
                    backgroundColor: colors.imageGrey,
                  }}
                  style={{ height: 119, width: 80 }}
                />
              </TouchableOpacity>
            )}
          />}
      </View>
    );
  }

  render() {
    const { active } = this.props;
    const data = this.props[active];
    return (
      <View style={{ backgroundColor: '#FAFAFA' }}>
        {this.renderGallery(data.topAiring, `Top Airing ${_.upperFirst(active)}`, 'topAiring')}
        {this.renderGallery(
          data.topUpcoming,
          `Top Upcoming ${_.upperFirst(active)}`,
          'topUpcoming',
        )}
        {this.renderGallery(data.highest, `Highest Rated ${_.upperFirst(active)}`, 'highest')}
        {this.renderGallery(data.popular, `Most Popular ${_.upperFirst(active)}`, 'popular')}
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
      </View>
    );
  }
}

TopsList.propTypes = {
  active: PropTypes.string.isRequired,
  getDefaults: PropTypes.func.isRequired,
};

const mapStateToProps = ({ anime }) => {
  const {
    topAiringanime,
    topAiringmanga,
    topUpcominganime,
    topUpcomingmanga,
    highestanime,
    highestmanga,
    popularanime,
    popularmanga,
    topAiringLoading,
    topUpcomingLoading,
    highestLoading,
    popularLoading,
  } = anime;
  return {
    anime: {
      topAiring: topAiringanime,
      topUpcoming: topUpcominganime,
      highest: highestanime,
      popular: popularanime,
      topAiringLoading,
      topUpcomingLoading,
      highestLoading,
      popularLoading,
    },
    manga: {
      topAiring: topAiringmanga,
      topUpcoming: topUpcomingmanga,
      highest: highestmanga,
      popular: popularmanga,
      topAiringLoading,
      topUpcomingLoading,
      highestLoading,
      popularLoading,
    },
  };
};

TopsList.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { getDefaults })(TopsList);
