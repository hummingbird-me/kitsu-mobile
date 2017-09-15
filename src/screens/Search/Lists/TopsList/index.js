import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { upperFirst } from 'lodash';
import { getDefaults, getCategories } from 'kitsu/store/anime/actions';
import { ContentList } from 'kitsu/components/ContentList';
import { styles } from './styles';

class TopsList extends PureComponent {
  componentWillMount() {
    const { active } = this.props;
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
    const { active, navigation: { navigate } } = this.props;
    const data = this.props[active] || {};
    const activeLabel = upperFirst(active);

    const streamingServices = [
      {
        name: 'netflix',
        image: require('kitsu/assets/img/streaming-services/netflix.png'),
      },
      {
        name: 'hulu',
        image: require('kitsu/assets/img/streaming-services/hulu.png'),
      },
      {
        name: 'crunchyroll',
        image: require('kitsu/assets/img/streaming-services/crunchyroll.png'),
      },
      {
        name: 'funimation',
        image: require('kitsu/assets/img/streaming-services/funimation.png'),
      },
      {
        name: 'viewster',
        image: require('kitsu/assets/img/streaming-services/viewster.png'),
      },
    ];

    const seasonsData = [
      {
        title: 'Fall 2017',
        image: require('kitsu/assets/img/seasons/Fall.png'),
      },
      {
        title: 'Summer 2017',
        image: require('kitsu/assets/img/seasons/Summer.png'),
      },
      {
        title: 'Spring 2017',
        image: require('kitsu/assets/img/seasons/Spring.png'),
      },
      {
        title: 'Winter 2017',
        image: require('kitsu/assets/img/seasons/Winter.png'),
      },
    ];

    const animeData = [
      {
        title: 'Action',
        image: require('kitsu/assets/img/anime-categories/Action.png'),
      },
      {
        title: 'Adventure',
        image: require('kitsu/assets/img/anime-categories/Adventure.png'),
      },
      {
        title: 'Comedy',
        image: require('kitsu/assets/img/anime-categories/Comedy.png'),
      },
      {
        title: 'Daily Life',
        image: require('kitsu/assets/img/anime-categories/DailyLife.png'),
      },
      {
        title: 'Fantasy',
        image: require('kitsu/assets/img/anime-categories/Fantasy.png'),
      },
      {
        title: 'Romance',
        image: require('kitsu/assets/img/anime-categories/Romance.png'),
      },
      {
        title: 'Science Fiction',
        image: require('kitsu/assets/img/anime-categories/ScienceFiction.png'),
      },
      {
        title: 'Sports',
        image: require('kitsu/assets/img/anime-categories/Sports.png'),
      },
    ];

    const mangaData = [
      {
        title: 'Action',
        image: require('kitsu/assets/img/manga-categories/Action.png'),
      },
      {
        title: 'Adventure',
        image: require('kitsu/assets/img/manga-categories/Adventure.png'),
      },
      {
        title: 'Comedy',
        image: require('kitsu/assets/img/manga-categories/Comedy.png'),
      },
      {
        title: 'Daily Life',
        image: require('kitsu/assets/img/manga-categories/DailyLife.png'),
      },
      {
        title: 'Fantasy',
        image: require('kitsu/assets/img/manga-categories/Fantasy.png'),
      },
      {
        title: 'Romance',
        image: require('kitsu/assets/img/manga-categories/Romance.png'),
      },
      {
        title: 'Science Fiction',
        image: require('kitsu/assets/img/manga-categories/ScienceFiction.png'),
      },
      {
        title: 'Sports',
        image: require('kitsu/assets/img/manga-categories/Sports.png'),
      },
    ];

    const listData = [
      {
        title: `Top Airing ${activeLabel}`,
        data: data.topAiring,
        type: 'topAiring',
      },
      {
        title: `${activeLabel} By Streaming`,
        dark: true,
        data: streamingServices,
        type: 'static',
      },
      {
        title: `Top Upcoming ${activeLabel}`,
        data: data.topUpcoming,
        type: 'topUpcoming',
      },
      {
        title: `${activeLabel} By Seasons`,
        data: seasonsData,
        dark: true,
        type: 'static',
      },
      {
        title: `Highest Rated ${activeLabel}`,
        data: data.highest,
        type: 'highest',
      },
      {
        title: `${activeLabel} By Categeory`,
        data: active === 'anime' ? animeData : mangaData,
        dark: true,
        type: 'static',
      },
      {
        title: `Most Popular ${activeLabel}`,
        data: data.popular,
        type: 'popular',
      },
    ];
    return (
      <ScrollView style={styles.scrollContainer}>
        {listData.map(listItem => (
          <ContentList
            {...listItem}
            navigate={navigate}
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

export default connect(mapStateToProps, { getDefaults, getCategories })(TopsList);
