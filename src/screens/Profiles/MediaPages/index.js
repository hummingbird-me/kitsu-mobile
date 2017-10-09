import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { TabRouter } from 'react-navigation';
import { connect } from 'react-redux';

import { TabBar, TabBarLink } from 'kitsu/screens/Profiles/MediaPages/components/TabBar';
import { SceneHeader } from 'kitsu/screens/Profiles/MediaPages/components/SceneHeader';
import { SceneContainer } from 'kitsu/screens/Profiles/MediaPages/components';
import Summary from 'kitsu/screens/Profiles/MediaPages/pages/Summary';

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
            variant="media"
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
          <TabScene setActiveTab={(tab) => this.setActiveTab(tab)} />
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