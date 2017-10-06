import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import {
  listBackPurple,
  lightGrey,
  offWhite,
} from 'kitsu/constants/colors';

import { scene, scenePadding } from './constants';

import {
  SceneContainer,
  SceneHeader,
} from './components';

import { HeaderMask } from './parts';

import Summary from './pages/Summary';
import Episodes from './pages/Episodes';
import Characters from './pages/Characters';
import Reactions from './pages/Reactions';
import Franchise from './pages/Franchise';

const tabBarOptions = {
  showIcon: false,
  activeTintColor: listBackPurple,
  inactiveTintColor: lightGrey,
  labelStyle: {
    fontSize: 12,
    fontFamily: 'OpenSans',
    fontWeight: '700',
  },
  style: {
    paddingHorizontal: scenePadding,
    height: 40,
    backgroundColor: offWhite,
  },
};

const TabScenes = TabNavigator({
  Summary: { screen: Summary, path: 'summary/:mediaId', initialRouteParams: 12 },
  Episodes: { screen: Episodes, path: 'episodes/:mediaId', initialRouteParams: 12 },
  Characters: { screen: Characters, path: 'characters/:mediaId', initialRouteParams: 12 },
  Reactions: { screen: Reactions, path: 'reactions/:mediaId', initialRouteParams: 12 },
  Franchise: { screen: Franchise, path: 'franchise/:mediaId', initialRouteParams: 12 },
}, {
  lazy: true,
  animationEnabled: false,
  tabBarPosition: 'top',
  tabBarOptions,
});

class MediaPages extends Component {
  static navigationOptions = {
    header: null,
    headerStyle: {
      backgroundColor: 'transparent',
    },
  }

  render() {
    const { media } = this.props;

    return (
      <SceneContainer>
        <ScrollView>
          <SceneHeader
            type={media.type}
            title={media.canonicalTitle}
            description={media.synopsis}
            coverImage={media.coverImage.original}
            posterImage={media.posterImage.large}
            popularityRank={media.popularityRank}
            ratingRank={media.ratingRank}
            categories={media.categories}
          />
          <TabScenes />
        </ScrollView>
        <HeaderMask />
      </SceneContainer>
    );
  }
}

MediaPages.propTypes = {
  media: PropTypes.object.required,
};

MediaPages.defaultProps = {
  media: {},
};

const mapStateToProps = (state) => {
  const { media } = state.media;

  return {
    media: media[12],
  };
};

export default connect(mapStateToProps, {})(MediaPages);
