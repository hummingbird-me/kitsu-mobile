import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { upperFirst } from 'lodash';
import { getDefaults, getStreamers, getCategories } from 'kitsu/store/anime/actions';
import { ContentList } from './ContentList';
import { styles } from './styles';

class TopsList extends PureComponent {
  componentWillMount() {
    const { active } = this.props;
    this.props.getStreamers();
    this.props.getCategories();
    this.props.getDefaults('topAiring', active);
    this.props.getDefaults('popular', active);
    this.props.getDefaults('highest', active);
    this.props.getDefaults('topUpcoming', active);
  }

  handleViewAllPress = (title, type) => {
    this.props.navigation.navigate('SearchResults', {
      label: title,
      default: type,
      active: this.props.active,
    });
  };

  render() {
    const { active, streamers, navigation: { navigate } } = this.props;
    const data = this.props[active] || {};

    const listData = [
      {
        title: `Top Airing ${upperFirst(active)}`,
        data: data.topAiring,
        type: 'topAiring',
      },
      {
        title: 'Anime By Streaming',
        dark: true,
        data: streamers,
        type: 'streaming',
      },
      {
        title: `Top Upcoming ${upperFirst(active)}`,
        data: data.topUpcoming,
        type: 'topUpcoming',
      },
      {
        title: `Highest Rated ${upperFirst(active)}`,
        data: data.highest,
        type: 'highest',
      },
      {
        title: `Most Popular ${upperFirst(active)}`,
        data: data.popular,
        type: 'popular',
      },
    ];
    return (
      <ScrollView style={styles.scrollContainer}>
        {listData.map(listItem => (
          <ContentList
            title={listItem.title}
            data={listItem.data}
            navigate={navigate}
            dark={listItem.dark || false}
            onPress={() => this.handleViewAllPress(listItem.title, listItem.type)}
          />
        ))}
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
    streamers,
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
    streamers,
  };
};

export default connect(mapStateToProps, { getDefaults, getStreamers, getCategories })(TopsList);
