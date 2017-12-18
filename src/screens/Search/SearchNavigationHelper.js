import { toLower, upperFirst, startCase } from 'lodash';
/**
 * Navigates to SearchResults with the given category and type filter.
 *
 * @param {Object} navigation The navigation object.
 * @param {string} type The type of media (anime or manga).
 * @param {string} category The category name.
 */
function showCategoryResults(navigation, type, category) {
  navigation.navigate('SearchResults', {
    label: startCase(toLower(category)),
    active: toLower(type),
    filter: {
      // Replace spaces with - and lower the string.
      categories: toLower(category.replace(/\s+/g, '-')),
    },
    sort: '-userCount',
  });
}

/**
 * Navigates to SearchResults with the given streamer filter.
 * @param {Object} navigation The navigation object.
 * @param {string} streamer The streamer name.
 */
function showStreamerResults(navigation, streamer) {
  navigation.navigate('SearchResults', {
    label: upperFirst(streamer),
    active: 'anime',
    filter: {
      streamers: toLower(streamer),
    },
    sort: '-userCount',
  });
}

/**
 * Navigates to SearchResults with the given season and year filters.
 * @param {Object} navigation The navigation object
 * @param {string} season The season (Winter, Spring, Summer, Fall)
 * @param {number} year The year.
 */
function showSeasonResults(navigation, season, year) {
  navigation.navigate('SearchResults', {
    label: `${season} ${year}`,
    active: 'anime',
    filter: {
      season: toLower(season),
      season_year: year,
    },
    sort: '-userCount',
  });
}

export { showSeasonResults, showStreamerResults, showCategoryResults };
