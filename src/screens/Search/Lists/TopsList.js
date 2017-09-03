import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Left, Right, Button, Text, Item } from 'native-base';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as colors from 'kitsu/constants/colors';
import { getDefaults } from 'kitsu/store/anime/actions';
import { MediaCard } from 'kitsu/components/MediaCard';

const list = [
  { label: 'Release date', key: 'release' },
  { label: 'Category', key: 'categories', title: 'Select Categories' },
  { label: 'Streaming Service', key: 'service' },
];

class TopsList extends Component {
  componentDidMount() {
    this.init(this.props.active);
  }

  init = (type) => {
    this.props.getDefaults('topAiring', type);
    this.props.getDefaults('popular', type);
    this.props.getDefaults('highest', type);
    this.props.getDefaults('topUpcoming', type);
  }

  renderList = () => {
    const { active } = this.props;
    return (
      <FlatList
        style={{ backgroundColor: colors.listBackPurple }}
        data={list}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <Item
            button
            key={item.id}
            style={{
              height: 35,
              flexDirection: 'row',
              paddingLeft: 17,
              paddingRight: 17,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderBottomWidth: 0,
              borderColor: colors.listSeparatorColor,
            }}
            onPress={() => this.props.navigation.navigate('SearchCategory', { ...item, active })}
          >
            <Left>
              <Text
                style={{
                  color: colors.white,
                  fontFamily: 'OpenSans',
                  fontWeight: '600',
                  fontSize: 13,
                  lineHeight: 18,
                }}
              >
                {item.label}
              </Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" style={{ fontSize: 17, color: colors.white }} />
            </Right>
          </Item>
        )}
      />
    );
  }

  renderGallery = (array, title, type) => {
    const { active } = this.props;
    const data = array.length > 0
      ? array
      : Array(10).fill(1).map((item, index) => ({ key: index }));

    return (
      <View style={{ backgroundColor: colors.listBackPurple }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 11,
            alignItems: 'center',
            marginBottom: 15.72,
            height: 17,
            marginTop: type === 'topAiring' ? 13 : 28.68,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'OpenSans',
              fontWeight: 'bold',
              lineHeight: 17,
              color: colors.categoryTextColor,
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
                color: colors.white,
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
                color: colors.white,
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
              <MediaCard
                cardDimensions={{ height: 120, width: 80 }}
                mediaData={item}
                navigate={this.props.navigation.navigate}
                style={index === 0 ? { marginLeft: 11 } : null}
              />
            )}
          />}
      </View>
    );
  }

  render() {
    const { active } = this.props;
    const data = this.props[active];
    return (
      <View style={{ backgroundColor: colors.listBackPurple }}>
        {this.renderGallery(data.topAiring, `Top Airing ${_.upperFirst(active)}`, 'topAiring')}
        {this.renderGallery(
          data.topUpcoming,
          `Top Upcoming ${_.upperFirst(active)}`,
          'topUpcoming',
        )}
        {this.renderGallery(data.highest, `Highest Rated ${_.upperFirst(active)}`, 'highest')}
        {this.renderGallery(data.popular, `Most Popular ${_.upperFirst(active)}`, 'popular')}
        <View style={{ paddingLeft: 16, paddingRight: 16, marginTop: 31.68, marginBottom: 10.5 }}>
          <Text
            style={{
              color: colors.categoryTextColor,
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
