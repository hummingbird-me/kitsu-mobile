export const idExtractor = item => item.id;
// eslint-disable-next-line no-underscore-dangle
export const underscoreIdExtractor = item => item._id;

export const isIdForCurrentUser = (id, currentUser) => currentUser.id === id;

/**
 * Get the Best Grid Spacing from the given itemWidths.
 * The best spacing is the one with a margin that is close to minMargin.
 *
 * @param {number[]} itemWidths An array of widths. I.e [10, 20, 30]
 * @param {number} availableWidth The width of the grid/The amount of space we can work with.
 * @param {number} minMargin The minimum margin to keep between items and around the edges.
 * @returns {Object} An object containing the best spacing and the item width associated with it.
 */
export function getBestGridItemSpacing(itemWidths, availableWidth, minMargin) {
  // Find the best spacing
  let bestSpacing = null;
  let bestWidth = null;

  itemWidths.forEach((width) => {
    const spacing = getGridItemSpacing(width, availableWidth, minMargin);

    if (!bestSpacing) {
      bestSpacing = spacing;
      bestWidth = width;
      // Best spacing is the one with the smallest margin and smallest extra space
    } else if (spacing.columnCount > 0 && (spacing.margin < bestSpacing.margin ||
      (spacing.margin === bestSpacing.margin && spacing.extra < bestSpacing.extra))) {
      bestSpacing = spacing;
      bestWidth = width;
    }
  });

  return {
    ...bestSpacing,
    width: bestWidth,
  };
}

/**
 * Get the Grid Spacing required for a uniform grid look.
 * I.e All the items are spaced evenly apart.
 * Take a look at ResultsList.js for an example on how this can be applied.
 *
 * @param {number} itemWidth The width of the item.
 * @param {number} availableWidth The width of the grid/The amount of space we can work with.
 * @param {number} minMargin The minimum margin to keep between items and around the edges.
 * @param {boolean} [distributeExtraToMargin=true]
 *                   Whether any extra space should be distributed evenly to margin.
 * @returns {Object} An object containing the margin, columnCount and extra space remaining.
 */
export function getGridItemSpacing(
  itemWidth,
  availableWidth,
  minMargin,
  distributeExtraToMargin = true,
) {
  // The margin we are working with
  let edgeMargin = minMargin;
  const innerMargin = edgeMargin * 2;

  // The amount of space we can work with
  // Not sure if we need to make this a float or not.
  const maxContentWidth = availableWidth - (edgeMargin * 2);

  // The amount of items we can fit in the given space
  let columnCount = Math.floor(maxContentWidth / itemWidth);

  // We have to check if we can fit in the items
  // Or if we have to reduce the columnCount to meet minMargin.
  let neededContentWidth = Infinity;
  while (columnCount > 0 && neededContentWidth > maxContentWidth) {
    neededContentWidth = (columnCount * itemWidth) + ((columnCount - 1) * innerMargin);
    columnCount -= 1;
  }

  if (neededContentWidth > maxContentWidth) return null;
  columnCount += 1;

  // Get the extra space we have remaining
  let extraSpace = availableWidth - (
    (edgeMargin * 2) + // Margin around first and last items
    (columnCount * itemWidth) + // Number of items we can fit in the space
    ((columnCount - 1) * innerMargin) // Margin between the items
  );

  // Try and distribute extra space between the margins
  if (distributeExtraToMargin) {
    const marginCount = columnCount + 1;
    const extraMargin = Math.floor(extraSpace / marginCount);

    // Add extra margin and subtract from the extra space
    // The reason we divide by 2 is because we want the margin for one side only
    // Not the combined margin of both sides
    edgeMargin += extraMargin / 2;
    extraSpace -= extraMargin * marginCount;
  }

  return {
    margin: edgeMargin,
    extra: extraSpace,
    columnCount,
  };
}
