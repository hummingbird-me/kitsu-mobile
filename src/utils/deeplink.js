import { Linking } from 'react-native';
import DeepLinking from 'react-native-deep-linking';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'kitsu/navigation';
import { Kitsu } from 'kitsu/config/api';
import store from 'kitsu/store/config';
import { isEmpty } from 'lodash';
import { fetchPost, fetchComment } from './feed';

// The current visible component id
let visibleComponentId = null;

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
  // Make sure we have the id of the visible screen so that if user deep links we can push straight from that
  Navigation.events().registerComponentDidAppearListener(({ componentId, componentName }) => {
    // Screens that we can't deep link on
    // This is because these don't have navigation stacks
    const COMPONENT_BLACKLIST = [Screens.FEED_CREATE_POST, Screens.LIGHTBOX];

    // If we come across them then push the deep link screens on the last visible components
    if (!COMPONENT_BLACKLIST.includes(componentName)) {
      visibleComponentId = componentId;
    }
  });

  registerDeepLinkRoutes();

  // Handle urls from `Linking`
  Linking.addEventListener('url', handleUrl);

  Linking.getInitialURL().then((url) => {
    if (url) {
      Linking.openURL(url);
    }
  }).catch(err => console.error('An error occurred', err));
}

/**
 * Unregister deeplinking event listeners
 */
export function unregisterDeepLinks() {
  Linking.removeEventListener('url', handleUrl);
}

/**
 * Register routes used for deep linking
 */
function registerDeepLinkRoutes() {
  // Handle both http and https
  DeepLinking.addScheme('http://');
  DeepLinking.addScheme('https://');

  DeepLinking.addRoute('kitsu.io/anime/:id', response => handleMedia(response, 'anime'));
  DeepLinking.addRoute('kitsu.io/manga/:id', response => handleMedia(response, 'manga'));
  DeepLinking.addRoute('kitsu.io/users/:id', handleUser);
  DeepLinking.addRoute('kitsu.io/posts/:id', handlePost);
  DeepLinking.addRoute('kitsu.io/comments/:id', handleComment);
}

/**
 * Check if a parameter is numeric
 *
 * @param {*} x A number or string to checkl
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
  if (!visibleComponentId || !response.id) return;
  let mediaId = response.id;

  // Fetch id if it's a slug
  if (!isNumeric(response.id)) {
    try {
      const media = await Kitsu.findAll(type, {
        filter: {
          slug: response.id,
        },
        fields: {
          anime: 'id',
        },
      });
      mediaId = (media && media.length > 0) ? media[0].id : null;
      console.log(media);
    } catch (e) {
      console.log(`Failed to fetch ${type} with slug: ${response.id}`, e);
      mediaId = null;
      return;
    }
  }

  if (mediaId) {
    Navigation.push(visibleComponentId, {
      component: {
        name: Screens.MEDIA_PAGE,
        passProps: {
          mediaId,
          mediaType: type,
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
  if (!visibleComponentId || !response.id) return;
  let userId = response.id;

  // Fetch id if it's a slug
  if (!isNumeric(userId)) {
    try {
      const user = await Kitsu.findAll('users', {
        filter: {
          slug: userId,
        },
        fields: {
          users: 'id',
        },
      });
      userId = (user && user.length > 0) ? user[0].id : null;
      console.log(user);
    } catch (e) {
      console.log(`Failed to fetch user with slug: ${userId}`, e);
      userId = null;
      return;
    }
  }

  if (userId) {
    Navigation.push(visibleComponentId, {
      component: {
        name: Screens.PROFILE_PAGE,
        passProps: { userId },
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

  const post = await fetchPost(response.id);
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

  const comment = await fetchComment(response.id);
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
