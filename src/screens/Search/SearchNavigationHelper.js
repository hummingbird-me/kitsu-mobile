import { toLower, upperFirst, startCase } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'app/navigation';
/**
 * Navigates to SearchResults with the given category and type filter.
 *
 * @param {any} componentId A componentId to use for navigation
 * @param {string} type The type of media (anime or manga).
 * @param {string} category The category name.
 */
function showCategoryResults(componentId, type, category) {
  Navigation.push(componentId, {
    component: {
      name: Screens.SEARCH_RESULTS,
      passProps: {
        label: startCase(toLower(category)),
        active: toLower(type),
        filter: {
          // Replace spaces with - and lower the string.
          categories: toLower(category.replace(/\s+/g, '-')),
        },
        sort: '-userCount',
      },
    },
  });
}

/**
 * Navigates to SearchResults with the given streamer filter.
 * @param {any} componentId A componentId to use for navigation
 * @param {string} streamer The streamer name.
 */
function showStreamerResults(componentId, streamer) {
  Navigation.push(componentId, {
    component: {
      name: Screens.SEARCH_RESULTS,
      passProps: {
        label: upperFirst(streamer),
        active: 'anime',
        filter: {
          streamers: toLower(streamer),
        },
        sort: '-userCount',
      },
    },
  });
}

/**
 * Navigates to SearchResults with the given season and year filters.
 * @param {any} componentId A componentId to use for navigation
 * @param {string} season The season (Winter, Spring, Summer, Fall)
 * @param {number} year The year.
 */
function showSeasonResults(componentId, season, year) {
  Navigation.push(componentId, {
    component: {
      name: Screens.SEARCH_RESULTS,
      passProps: {
        label: `${season} ${year}`,
        active: 'anime',
        filter: {
          season: toLower(season),
          season_year: year,
        },
        sort: '-userCount',
      },
    },
  });
}

export { showSeasonResults, showStreamerResults, showCategoryResults };
