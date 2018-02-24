import { parseURL } from 'kitsu/common/utils/url';
import { kitsuConfig } from 'kitsu/config/env';
import { coverImageDimensions } from 'kitsu/constants/app';
import { isEmpty } from 'lodash';

export const defaultImgixOptions = {
  w: coverImageDimensions.width,
  'max-h': coverImageDimensions.height,
  fit: 'crop',
  crop: 'faces,edges',
  auto: 'format',
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
    ...defaultImgixOptions,
    ...imageOptions,
  };

  if (!coverImage) return null;

  // Get the cover url
  const coverURL = coverImage.original ||
  coverImage.large ||
  coverImage.medium ||
  coverImage.small ||
  null;

  if (!coverURL) return null;

  // Parse it
  const { hostname, pathname, search } = parseURL(coverURL);
  if (!hostname.toLowerCase().includes('kitsu')) return coverURL;

  // Build the search params
  const mappings = Object.keys(options).filter(k => options[k]).map(key => `${key}=${options[key]}`);
  const searchParams = mappings.join('&');

  // Replace host with imgix
  // This also ensures we keep the cache buster number at the end of the url
  const coverSearchParam = isEmpty(search) ? '?' : `${search}&`;
  const imgixURL = `https://${kitsuConfig.imgixBaseUrl}${pathname}${coverSearchParam}${searchParams}`;

  return imgixURL;
}
