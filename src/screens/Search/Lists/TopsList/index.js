import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { upperFirst, isEmpty, isNull } from 'lodash';
import { getDefaults, getCategories } from 'kitsu/store/anime/actions';
import { ContentList } from 'kitsu/components/ContentList';
import { showSeasonResults, showStreamerResults, showCategoryResults } from 'kitsu/screens/Search/SearchNavigationHelper';
import { STREAMING_SERVICES } from 'kitsu/constants/app';
import { Navigation } from 'react-native-navigation';
import { PropTypes } from 'prop-types';
import { Screens } from 'kitsu/navigation';
import { styles } from './styles';

class TopsList extends PureComponent {
  static propTypes = {
    componentId: PropTypes.any.isRequired,
  }

  componentWillMount() {
    const { active } = this.props;
    this.props.getCategories();
    this.props.getDefaults('topAiring', active);
    this.props.getDefaults('popular', active);
    this.props.getDefaults('highest', active);
    this.props.getDefaults('topUpcoming', active);
  }

  /**
   * Get the season corresponding to the given month
   * @param  {number} month The integer month (1 - 12)
   * @return {string} The season (Winter, Spring, Summer, Fall).
   */
  getSeason(month) {
    // Make sure month is an integer in 1 - 12
    const normalised = ((month - 1) % 12) + 1;
    if (normalised >= 1 && normalised <= 3) {
      return 'Winter';
    } else if (normalised >= 4 && normalised <= 6) {
      return 'Spring';
    } else if (normalised >= 7 && normalised <= 9) {
      return 'Summer';
    }
    return 'Fall';
  }

  getSeasonsData() {
    // This will only show the past 2 year worth of seasons
    // The rest should be viewable in 'View All'
    const curMonth = new Date().getMonth() + 1;
    const curYear = new Date().getFullYear();
    const minYear = curYear - 2;
    const data = [];

    const seasons = ['Fall', 'Summer', 'Spring', 'Winter'];

    // Get the data object for the given season and year
    const getData = (season, year) => {
      const images = {
        Winter: require('kitsu/assets/img/seasons/Winter.png'),
        Spring: require('kitsu/assets/img/seasons/Spring.png'),
        Summer: require('kitsu/assets/img/seasons/Summer.png'),
        Fall: require('kitsu/assets/img/seasons/Fall.png'),
      };

      return {
        title: `${season} ${year}`,
        image: images[season],
        onPress: () => showSeasonResults(this.props.componentId, season, year),
      };
    };

    const curSeason = this.getSeason(curMonth);

    // Add the next season to the data
    const nextSeason = this.getSeason(curMonth + 3);
    const nextSeasonYear = curSeason === 'Fall' ? curYear + 1 : curYear;
    data.push(getData(nextSeason, nextSeasonYear));

    // Add all the seasons up to the current season in the current year
    for (let i = seasons.indexOf(curSeason); i < 4; i += 1) {
      data.push(getData(seasons[i], curYear));
    }

    // All all the seasons from previous years
    for (let year = curYear - 1; year >= minYear; year -= 1) {
      seasons.forEach((season) => {
        data.push(getData(season, year));
      });
    }

    return data;
  }

  getAnimeCategories() {
    return [
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
  }

  getMangaCategories() {
    return [
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
  }

  /**
   * Get the list data for the given media type.
   * @param  {string} type `Anime` or `Manga`.
   * @param  {Object} data The props data.
   * @return {Object[]}  An array of data for the given media type.
   */
  getListData(type, data) {
    const seasons = this.getSeasonsData();
    const seasonsData = {
      title: `${type} By Seasons`,
      data: seasons,
      dark: true,
      type: 'static',
      action: 'season',
    };

    // Construct the streaming object
    const streamingServices = Object.keys(STREAMING_SERVICES).map(k => (
      !isNull(STREAMING_SERVICES[k]) && {
        name: k,
        image: STREAMING_SERVICES[k],
      }
    ))
      .filter(s => !isEmpty(s))
      .map(streamer => ({
        ...streamer,
        // Add the touch handler for the streamers
        onPress: () => showStreamerResults(this.props.componentId, streamer.name),
      }));

    const streamingData = {
      title: `${type} By Streaming`,
      dark: true,
      data: streamingServices,
      type: 'static',
      showViewAll: false,
    };

    // Because react doesn't allow dynamic image loading, we have to do it this way :(
    const categories = (type === 'Anime') ? this.getAnimeCategories() : this.getMangaCategories();

    // Add the touch handler for the categories
    const mappedCategories = categories.map(category => ({
      ...category,
      onPress: () => showCategoryResults(this.props.componentId, type, category.title),
    }));

    const categoryData = {
      title: `${type} By Category`,
      data: mappedCategories,
      dark: true,
      type: 'static',
      showViewAll: false,
    };

    // Loading data is just an array of empty objects
    const loadingData = Array(20).fill({});

    const topData = {
      title: (type === 'Anime') ? `Top Airing ${type}` : `Top Publishing ${type}`,
      data: isEmpty(data.topAiring) ? loadingData : data.topAiring,
      type: isEmpty(data.topAiring) ? 'loading' : 'topAiring',
    };

    const upcomingData = {
      title: `Top Upcoming ${type}`,
      data: isEmpty(data.topUpcoming) ? loadingData : data.topUpcoming,
      type: isEmpty(data.topUpcoming) ? 'loading' : 'topUpcoming',
    };

    const highestRatedData = {
      title: `Highest Rated ${type}`,
      data: isEmpty(data.highest) ? loadingData : data.highest,
      type: isEmpty(data.highest) ? 'loading' : 'highest',
    };

    const mostPopularData = {
      title: `Most Popular ${type}`,
      data: isEmpty(data.popular) ? loadingData : data.popular,
      type: isEmpty(data.popular) ? 'loading' : 'popular',
    };

    const animeData = [
      topData,
      streamingData,
      upcomingData,
      seasonsData,
      highestRatedData,
      categoryData,
      mostPopularData,
    ];

    const mangaData = [
      topData,
      highestRatedData,
      categoryData,
      mostPopularData,
    ];

    return (type === 'Anime') ? animeData : mangaData;
  }

  handleViewAllPress = (title, type, action) => {
    if (action === 'season') {
      Navigation.push(this.props.componentId, {
        component: {
          name: Screens.SEARCH_SEASON,
          passProps: {
            label: 'Seasons',
          },
        },
      });
      return;
    }

    Navigation.push(this.props.componentId, {
      component: {
        name: Screens.SEARCH_RESULTS,
        passProps: {
          label: title,
          default: type,
          active: this.props.active,
        },
      },
    });
  };

  render() {
    const { active, componentId } = this.props;
    const data = this.props[active] || {};
    const activeLabel = upperFirst(active);

    const listData = this.getListData(activeLabel, data);

    return (
      <ScrollView style={styles.scrollContainer}>
        {listData.map(listItem => (
          <ContentList
            {...listItem}
            key={listItem.name || listItem.title}
            componentId={componentId}
            onPress={() => this.handleViewAllPress(listItem.title, listItem.type, listItem.action)}
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
