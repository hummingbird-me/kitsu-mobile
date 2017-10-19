import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { TabRouter } from 'react-navigation';
import { connect } from 'react-redux';

import { TabBar, TabBarLink } from 'kitsu/screens/Profiles/components/TabBar';
import { SceneHeader } from 'kitsu/screens/Profiles/components/SceneHeader';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import Summary from 'kitsu/screens/Profiles/MediaPages/pages/Summary';

const MAIN_BUTTON_OPTIONS = ['Watch', 'Want to Watch', 'Completed', 'On Hold', 'Dropped', 'Cancel', 'Nevermind'];
const MORE_BUTTON_OPTIONS = ['Add to Favorites', 'Follow this Anime\'s Feed', 'Nevermind'];

const TAB_ITEMS = [
  { key: 'summary', label: 'Summary', screen: 'Summary' },
  { key: 'episodes', label: 'Episodes', screen: 'Episodes' },
  { key: 'characters', label: 'Characters', screen: 'Characters' },
  { key: 'reactions', label: 'Reactions', screen: 'Reactions' },
  { key: 'franchise', label: 'Franchise', screen: 'Franchise' },
];

/* eslint-disable global-require */

const TabRoutes = TabRouter({
  Summary: { screen: Summary },
  Episodes: { getScreen: () => require('./pages/Episodes').Episodes },
  Characters: { getScreen: () => require('./pages/Characters').Characters },
  Reactions: { getScreen: () => require('./pages/Reactions').Reactions },
  Franchise: { getScreen: () => require('./pages/Franchise').Franchise },
}, {
  initialRouteName: 'Summary',
});

/* eslint-enable global-require */

class MediaPages extends Component {
  static propTypes = {
    media: PropTypes.object.required,
  }

  static defaultProps = {
    media: {},
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: 'transparent',
      height: 20,
    },
  }

  state = { active: 'Summary' }

  onMainButtonOptionsSelected = () => {}
  onMoreButtonOptionsSelected = () => {}

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
            variant="media"
            media={media}
            type={media.type}
            title={media.canonicalTitle}
            description={media.synopsis}
            coverImage={media.coverImage && media.coverImage.original}
            posterImage={media.posterImage && media.posterImage.large}
            popularityRank={media.popularityRank}
            ratingRank={media.ratingRank}
            categories={media.categories}
            mainButtonTitle="Add to library"
            mainButtonOptions={MAIN_BUTTON_OPTIONS}
            onMainButtonOptionsSelected={this.onMainButtonOptionsSelected}
            moreButtonOptions={MORE_BUTTON_OPTIONS}
            onMoreButtonOptionsSelected={this.onMoreButtonOptionsSelected}
          />
          {this.renderTabNav()}
          <TabScene setActiveTab={tab => this.setActiveTab(tab)} />
        </ScrollView>
      </SceneContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { media } = state.media;

  return {
    media: media[12],
  };
};

export default connect(mapStateToProps, {})(MediaPages);
