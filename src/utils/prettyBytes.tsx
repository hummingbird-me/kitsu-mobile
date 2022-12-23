
import { isFinite } from 'lodash';

const UNITS = [
  'B',
  'kB',
  'MB',
  'GB',
  'TB',
  'PB',
  'EB',
  'ZB',
  'YB',
];

/**
 * Convert byte display to a pretty byte display (human readable values).
 * E.G 100 -> 100B
 *
 * Original source: https://github.com/sindresorhus/pretty-bytes
 *
 * @param {number} number The byte number to pretty. Must be > 0.
 * @returns The pretty byte number
 */
export const prettyBytes = (number) => {
  if (!isFinite(number)) return '-';
  const exponent = Math.min(Math.floor(Math.log10(number) / 3), UNITS.length - 1);

  // NOTE: Don't use `**` even if elint tells you to.
  // It will make it so the app won't work properly on android.
  const numberString = Number((number / Math.pow(1000, exponent)).toPrecision(3));
  const unit = UNITS[exponent];

  return `${numberString} ${unit}`;
};
