
import * as React from 'react';
import { View, Linking, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import DeepLinking from 'react-native-deep-linking';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'kitsu/navigation';
import { Kitsu } from 'kitsu/config/api';
import store from 'kitsu/store/config';
import { isEmpty, isNull } from 'lodash';
import { toggleActivityIndicatorHOC } from 'kitsu/store/app/actions';
import { fetchPost, fetchComment } from './feed';

// The current visible component id
let visibleComponentId = null;

// Global variables
let registeredDeepLinks = false;
let registeredUrlHandler = false;

/**
 * Open the url passed by `Linking`
 * Checks to see if the url is supported by an app before opening it.
 *
 * @param { string } url The url to open
 */
export async function openUrl(url) {
  try {
    const supported = await Linking.canOpenURL(url);
    // Open url with `DeepLinking` but if that fails then fall back to `Linking`
    if (supported && !DeepLinking.evaluateUrl(url)) {
      Linking.openURL(url);
    }
  } catch (e) {
    console.log(`Error handling ${url}: ${e}`);
  }
}

function handleUrl({ url }) {
  openUrl(url);
}

/**
 * Register deeplinking event listeners
 */
export function registerDeepLinks() {
  // Handle urls from `Linking`
  // Make sure we only add the listener once
  if (!registeredUrlHandler) {
    Linking.addEventListener('url', handleUrl);
    registeredUrlHandler = true;
  }

  // Make sure we only register the events below once
  if (registeredDeepLinks) return;

  Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex }) => setDeepLinkTabIndex(selectedTabIndex));

  // Check to see if user is on a valid screen for deep linking
  Navigation.events().registerComponentDidAppearListener(({ componentName }) => {
    // If user views the auth screen then set the visible component id to null
    if (componentName === Screens.AUTH_INTRO) {
      visibleComponentId = null;
    }
  });

  registerDeepLinkRoutes();

  Linking.getInitialURL().then((url) => {
    if (url) {
      openUrl(url);
    }
  }).catch(err => console.error('An error occurred', err));

  registeredDeepLinks = true;
}

/**
 * Unregister deeplinking event listeners
 */
export function unregisterDeepLinks() {
  Linking.removeEventListener('url', handleUrl);
  registeredUrlHandler = false;
}


/**
 * Set the `visibleComponentId` for deep linking.
 * This is a hack method as we don't get a callback from `registerBottomTabSelectedListener` on initial launch.
 * 
 * @param {number} tabIndex The index of the tab.
 */
export function setDeepLinkTabIndex(tabIndex) {
  // We just listen to tab events and push accordingly
  const tabs = [Screens.FEED, Screens.SEARCH, Screens.QUICK_UPDATE, Screens.NOTIFICATION, Screens.LIBRARY];
  if (tabIndex < 0 || tabIndex >= tabs.length) {
    visibleComponentId = null;
  }

  visibleComponentId = tabs[tabIndex];
}

/**
 * Register routes used for deep linking
 */
function registerDeepLinkRoutes() {
  DeepLinking.addScheme('https://');

  // Media pages
  DeepLinking.addRoute('kitsu.io/anime/:id', response => handleMedia(response, 'anime'));
  DeepLinking.addRoute('kitsu.io/manga/:id', response => handleMedia(response, 'manga'));
  DeepLinking.addRoute('kitsu.io/anime/:id/:tab', response => handleMedia(response, 'anime'));
  DeepLinking.addRoute('kitsu.io/manga/:id/:tab', response => handleMedia(response, 'manga'));
  DeepLinking.addRoute('kitsu.io/anime/:id/episodes/:number', response => handleUnit(response, 'anime'));
  DeepLinking.addRoute('kitsu.io/manga/:id/chapters/:number', response => handleUnit(response, 'manga'));

  // User pages
  DeepLinking.addRoute('kitsu.io/users/:id', handleUser);
  DeepLinking.addRoute('kitsu.io/users/:id/:tab', handleUser);

  // Other
  DeepLinking.addRoute('kitsu.io/posts/:id', handlePost);
  DeepLinking.addRoute('kitsu.io/comments/:id', handleComment);
  DeepLinking.addRoute('kitsu.io/feedback/:type', handleFeedback);
}

/**
 * Check if a parameter is numeric
 *
 * @param {*} x A number or string to check
 * @returns Whether `x` is numeric
 */
function isNumeric(x) {
  return ((typeof x === 'number' || typeof x === 'string') && !isNaN(Number(x)));
}


/**
 * Handle media deeplinks
 *
 * @param {*} response The deep link response
 * @param {string} type The type of media. `anime` or `manga`
 */
const handleMedia = async (response, type) => {
  // Make sure that we have a valid route that we can navigate to.
  // If we don't have a valid route then open the url in the browser
  const validRoutes = ['episodes', 'chapters', 'reactions', 'franchise'];
  if (response && response.tab && !validRoutes.includes(response.tab)) {
    Linking.openURL(`${response.scheme}${response.path}`);
    return;
  }

  if (!visibleComponentId || !response.id) return;
  let mediaId = response.id;

  // Fetch id if it's a slug
  if (!isNumeric(response.id)) {
    try {
      store.dispatch(toggleActivityIndicatorHOC(true));
      const media = await Kitsu.findAll(type, {
        filter: {
          slug: response.id,
        },
        fields: {
          anime: 'id',
          manga: 'id',
        },
      });
      mediaId = (media && media.length > 0) ? media[0].id : null;
    } catch (e) {
      console.log(`Failed to fetch ${type} with slug: ${response.id}`, e);
      mediaId = null;
      return;
    } finally {
      store.dispatch(toggleActivityIndicatorHOC(false));
    }
  }

  if (mediaId) {
    Navigation.push(visibleComponentId, {
      component: {
        name: Screens.MEDIA_PAGE,
        passProps: {
          mediaId,
          mediaType: type,
          activeTab: response.tab,
        },
      },
    });
  }
};

const handleUnit = async (response, type) => {
  const unitType = type === 'anime' ? 'episodes' : 'chapters';
  let media = null;
  let unit = null;

  // Make sure we have valid inputs
  if (!response || !response.id || !isNumeric(response.number)) return;

  // Fetch the media first
  store.dispatch(toggleActivityIndicatorHOC(true));
  try {
    // Check if we need to fetch media based on slug
    if (!isNumeric(response.id)) {
      const results = await Kitsu.findAll(type, {
        filter: {
          slug: response.id,
        },
      });
      media = results && results.length > 0 && results[0];
    } else {
      // Just fetch media by the id
      media = await Kitsu.find(type, response.id);
    }
  } catch (e) {
    console.log(`Failed to fetch ${type} with id: ${response.id}`, e);
    media = null;
  }

  // Make sure we have a valid media object
  if (!media) {
    store.dispatch(toggleActivityIndicatorHOC(false));
    return;
  }

  // Fetch the unit
  try {
    const idKey = unitType === 'chapters' ? 'mangaId' : 'mediaId';
    const includes = type === 'anime' ? 'videos' : null;

    const results = await Kitsu.findAll(unitType, {
      filter: { [idKey]: media.id },
      includes,
    });
    unit = results && results.length > 0 && results[0];
  } catch (e) {
    console.log(`Failed to fetch ${unitType} with media: ${response.id}`, e);
    unit = null;
  } finally {
    store.dispatch(toggleActivityIndicatorHOC(false));
  }

  // Navigate to it
  if (media && unit) {
    Navigation.push(visibleComponentId, {
      component: {
        name: Screens.MEDIA_UNIT_DETAIL,
        passProps: {
          unit,
          media,
          shouldShowMediaCard: true,
        },
      },
    });
  }
};

/**
 * Handle user deeplinks
 *
 * @param {*} response The deep link response
 */
const handleUser = async (response) => {
  // Make sure that we have a valid route that we can navigate to.
  // If we don't have a valid route then open the url in the browser
  const validRoutes = ['library', 'groups', 'reactions'];
  if (response && response.tab && !validRoutes.includes(response.tab)) {
    Linking.openURL(`${response.scheme}${response.path}`);
    return;
  }
  
  if (!visibleComponentId || !response.id) return;
  let userId = response.id;

  // Fetch id if it's a slug
  if (!isNumeric(userId)) {
    try {
      store.dispatch(toggleActivityIndicatorHOC(true));
      const user = await Kitsu.findAll('users', {
        filter: {
          slug: userId,
        },
        fields: {
          users: 'id',
        },
      });
      userId = (user && user.length > 0) ? user[0].id : null;
    } catch (e) {
      console.log(`Failed to fetch user with slug: ${userId}`, e);
      userId = null;
      return;
    } finally {
      store.dispatch(toggleActivityIndicatorHOC(false));
    }
  }

  if (userId) {
    Navigation.push(visibleComponentId, {
      component: {
        name: Screens.PROFILE_PAGE,
        passProps: {
          userId,
          activeTab: response.tab,
        },
      },
    });
  }
};

/**
 * Handle post deeplinks
 *
 * @param {*} response The deep link response
 */
const handlePost = async (response) => {
  if (!visibleComponentId || !response.id || !isNumeric(response.id)) return;

  store.dispatch(toggleActivityIndicatorHOC(true));
  const post = await fetchPost(response.id);
  store.dispatch(toggleActivityIndicatorHOC(false));
  if (post) {
    navigateToPostDetails(post);
  }
};

/**
 * Handle comment deeplinks
 *
 * @param {*} response The deep link response
 */
const handleComment = async (response) => {
  if (!visibleComponentId || !response.id || !isNumeric(response.id)) return;

  store.dispatch(toggleActivityIndicatorHOC(true));
  const comment = await fetchComment(response.id);
  store.dispatch(toggleActivityIndicatorHOC(false));
  if (comment) {
    // If the comment isn't part of another comment then show the post
    if (!comment.parent && comment.post) {
      navigateToPostDetails(comment.post, [comment]);
    } else if (comment.parent) {
      // Otherwise show the main comment parent then the actual comment
      navigateToPostDetails(comment.parent, [comment]);
    } else {
      // Otherwise just show the comment
      navigateToPostDetails(comment);
    }
  }
};

const handleFeedback = (response) => {
  const auth = store.getState().auth;
  const accessToken = auth.tokens && auth.tokens.access_token;

  if (!accessToken || !visibleComponentId) return;

  switch (response.type) {
    case 'mobile-bugs':
      Navigation.push(visibleComponentId, {
        component: {
          name: Screens.SIDEBAR_CANNY_BOARD,
          passProps: {
            title: 'Report Bugs',
            type: 'bugReport',
            token: accessToken,
          },
        },
      });
      break;
    case 'mobile-features':
      Navigation.push(visibleComponentId, {
        component: {
          name: Screens.SIDEBAR_CANNY_BOARD,
          passProps: {
            title: 'Suggest Features',
            type: 'featureRequest',
            token: accessToken,
          },
        },
      });
      break;
    case 'database-requests':
      Navigation.push(visibleComponentId, {
        component: {
          name: Screens.SIDEBAR_CANNY_BOARD,
          passProps: {
            title: 'Database Requests',
            type: 'databaseRequest',
            token: accessToken,
          },
        },
      });
      break;
    default:
      // Unhandled route, just pass it off
      Linking.openURL(`${response.scheme}${response.path}`);
      break;
  }
};

const navigateToPostDetails = (post, comments = []) => {
  const currentUser = store.getState().user.currentUser;

  if (post && visibleComponentId) {
    Navigation.push(visibleComponentId, {
      component: {
        name: Screens.FEED_POST_DETAILS,
        passProps: {
          post,
          comments,
          showLoadMoreComments: !isEmpty(comments),
          like: null,
          currentUser,
        },
      },
    });
  }
};

/**
 * Add a ActivityIndicatorHOC wrapper around a component.
 *
 * @param {*} Component The component to add the wrapper around.
 * @returns Wrapped Component.
 */
export const withActivityIndicatorHOC = (Component) => {
  class ActivityIndicatorHOC extends React.PureComponent {
    constructor(props) {
      super(props);
      this.isVisible = false;
      Navigation.events().bindComponent(this);
    }

    componentDidAppear() {
      this.isVisible = true;
    }

    componentDidDisappear() {
      this.isVisible = false;
    }

    render() {
      const { activityIndicatorHOCVisible, ...props } = this.props;
      const showIndicator = this.isVisible && activityIndicatorHOCVisible;
      return (
        <View style={{ flex: 1 }}>
          <Component {...props} />
          {showIndicator &&
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.8)',
              }}
            >
              <ActivityIndicator color="white" />
            </View>
          }
        </View>
      );
    }
  }

  const mapStateToProps = ({ app }) => {
    const { activityIndicatorHOCVisible } = app;
    return { activityIndicatorHOCVisible };
  };

  return connect(mapStateToProps)(ActivityIndicatorHOC);
};
