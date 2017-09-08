import React, { PureComponent } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { upperFirst } from 'lodash';
import { getDefaults } from 'kitsu/store/anime/actions';
import { MediaCard } from 'kitsu/components/MediaCard';
import { ContentList } from './ContentList';
import { styles } from './styles';

class TopsList extends PureComponent {
  componentWillMount() {
    const { active } = this.props;
    this.props.getDefaults('topAiring', active);
    this.props.getDefaults('popular', active);
    this.props.getDefaults('highest', active);
    this.props.getDefaults('topUpcoming', active);
  }

  render() {
    const { active } = this.props;
    const data = this.props[active] || {};
    return (
      <ScrollView style={styles.scrollContainer}>
        <ContentList title={`Top Airing ${upperFirst(active)}`} data={data.topAiring} />
        <ContentList title={`Top Upcoming ${upperFirst(active)}`} data={data.topUpcoming} />
        <ContentList title={`Highest Rated ${upperFirst(active)}`} data={data.highest} />
        <ContentList title={`Most Popular ${upperFirst(active)}`} data={data.popular} />
      </ScrollView>
    );
  }
}

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

export default connect(mapStateToProps, { getDefaults })(TopsList);
