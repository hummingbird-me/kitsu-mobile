import { Dimensions } from 'react-native';
import { getBestGridItemSpacing } from 'kitsu/common/utils';

export const IMAGE_SIZE = { width: 100, height: 150 };

function getBestSpacing() {
  const itemWidths = [100, 105, 110, 115, 120, 125, 130];
  const width = Dimensions.get('window').width;
  const minMargin = 2;

  const best = getBestGridItemSpacing(itemWidths, width, minMargin);

  // The ratio of the poster/image
  const imageRatio = IMAGE_SIZE.width / IMAGE_SIZE.height;

  return {
    columnCount: 3,
    margin: minMargin,
    ...best,
    height: best.width * (1 / imageRatio),
  };
}

// Just need to calculate this once since we don't have landscape.
// If in the future we do support it then this will need to be changed.
export const bestSpacing = getBestSpacing();

/*
Get the maximum number of rows fit into the current device height
*/
export function getMaxVisibleRows() {
  const height = Dimensions.get('window').height;
  return Math.ceil(height / bestSpacing.height);
}

/*
Get the number of rows that are visible from the item count
*/
export function getCurrentVisibleRows(itemCount) {
  return Math.floor(itemCount / bestSpacing.columnCount);
}
