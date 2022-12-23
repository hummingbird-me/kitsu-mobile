import { parseURL, isKitsuUrl } from 'kitsu/utils/url';
import { kitsuConfig } from 'kitsu/config/env';
import { coverImageDimensions } from 'kitsu/constants/app';
import { isEmpty } from 'lodash';

export const defaultImgixOptions = {
  fit: 'crop',
  crop: 'faces,edges',
  auto: 'format',
};

/**
 * Get the imgix image url from the given url.
 *
 * This will convert the url from kitsu to imgix and apply all the necessary filters.
 * If it can't convert the url then the original url will be returned.
 *
 * @param {string} url The image url.
 * @param {object} imageOptions Image options to pass to imgix.
 */
export function getImgixImage(url, imageOptions = {}) {
  const options = {
    ...defaultImgixOptions,
    ...imageOptions,
  };

  if (isEmpty(url)) return null;

  // Don't continue if it's not a kitsu image
  if (!isKitsuUrl(url)) return url;

  // Parse it
  const parsed = parseURL(url);
  if (!parsed) return url;

  const { pathname } = parsed;

  // Build the search params
  const mappings = Object.keys(options).filter(k => options[k]).map(key => `${key}=${options[key]}`);
  const searchParams = mappings.join('&');

  // Make the new url
  return `https://${kitsuConfig.imgixBaseUrl}${pathname}?${searchParams}`;
}


export const defaultImgixCoverOptions = {
  ...defaultImgixOptions,
  w: coverImageDimensions.width,
  'max-h': coverImageDimensions.height,
};


/**
 * Get the imgix cover image url from the given coverImages.
 *
 * This will convert the cover url from kitsu to imgix and apply all the necessary filters.
 * If it can't convert the url then the original cover image will be returned.
 *
 * @param {object} coverImage An object containing coverImage urls.
 * @param {object} imageOptions Image options to pass to imgix.
 */
export function getImgixCoverImage(coverImage, imageOptions = {}) {
  const options = {
    ...defaultImgixCoverOptions,
    ...imageOptions,
  };

  if (isEmpty(coverImage) || typeof coverImage !== 'object') return null;

  // Get the cover url
  const coverURL = coverImage.original ||
  coverImage.large ||
  coverImage.medium ||
  coverImage.small ||
  null;

  return getImgixImage(coverURL, options);
}
