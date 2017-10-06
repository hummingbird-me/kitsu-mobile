import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, TouchableOpacity } from 'react-native';
import { TabRouter, TabNavigator } from 'react-navigation';
import glamorous from 'glamorous-native';
import { connect } from 'react-redux';

import {
  listBackPurple,
  grey,
  lightestGrey,
  offWhite,
} from 'kitsu/constants/colors';

import { scenePadding, borderWidth } from './constants';

import {
  SceneContainer,
  SceneHeader,
} from './components';

import { StyledText } from './parts';

import Summary from './pages/Summary';

const TAB_ITEMS = [
  { key: 'summary', label: 'Summary', screen: 'Summary' },
  { key: 'episodes', label: 'Episodes', screen: 'Episodes' },
  { key: 'characters', label: 'Characters', screen: 'Characters' },
  { key: 'reactions', label: 'Reactions', screen: 'Reactions' },
  { key: 'franchise', label: 'Franchise', screen: 'Franchise' },
];

const TabRoutes = TabRouter({
  Summary: { screen: Summary },
  Episodes: { getScreen: () => require('./pages/Episodes').default},
  Characters: { getScreen: () => require('./pages/Characters').default},
  Reactions: { getScreen: () => require('./pages/Reactions').default},
  Franchise: { getScreen: () => require('./pages/Franchise').default},
}, {
  initialRouteName: 'Summary',
});

const TabBar = glamorous.view({
  flexDirection: 'row',
  paddingVertical: scenePadding * 1.25,
  paddingHorizontal: scenePadding,
  backgroundColor: offWhite,
  alignItems: 'center',
  justifyContent: 'space-between',
  borderTopWidth: borderWidth.hairline,
  borderTopColor: lightestGrey,
  shadowColor: 'rgba(0,0,0,0.2)',
  shadowOffset: {
    width: 1,
    height: 1,
  },
  shadowOpacity: 1,
});

const TabBarLink = ({ onPress, label, isActive }) => (
  <TouchableOpacity onPress={onPress}>
    <StyledText color={isActive ? 'dark' : 'grey'} size="xsmall" bold>{label}</StyledText>
  </TouchableOpacity>
);

class MediaPages extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: 'transparent',
      height: 20,
    },
  }

  state = { active: 'Summary' }

  setActiveTab = (tab) => {
    this.setState({ active: tab });
  }

  renderTabNav = () => (
    <TabBar>
      {TAB_ITEMS.map(tabItem => (
        <TabBarLink
          key={tabItem.key}
          label={tabItem.label}
          isActive={this.state.active === tabItem.screen}
          onPress={() => this.setActiveTab(tabItem.screen)}
        />
      ))}
    </TabBar>
  );

  render() {
    const { media } = this.props;
    const TabScene = TabRoutes.getComponentForRouteName(this.state.active);

    return (
      <SceneContainer>
        <ScrollView stickyHeaderIndices={[1]}>
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
          {this.renderTabNav()}
          <TabScene />
        </ScrollView>
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
