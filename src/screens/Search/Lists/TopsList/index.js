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

  /**
   * Get the season corresponding to the given month
   * @param  {Int} month The integer month (1 - 12)
   * @return {String} The season (Winter, Spring, Summer, Fall).
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

    const seasonsData = this.getSeasonsData();

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
            key={listItem.name || listItem.title}
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
