import * as React from 'react';
import { Dimensions, View, FlatList, Text, TouchableOpacity, StyleSheet, ViewPropTypes } from 'react-native';
import * as PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { getBestGridItemSpacing } from 'kitsu/common/utils';
import { getComputedTitle } from 'kitsu/utils/getTitleField';

const IMAGE_SIZE = { width: 100, height: 150 };

const styles = StyleSheet.create({
  container: { backgroundColor: '#FAFAFA' },
  linearGradient: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  titleText: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 11,
    fontFamily: 'OpenSans',
    padding: 2,
  },
});

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
const bestSpacing = getBestSpacing();

const ResultsList = ({ hits, onPress, style, currentUser, ...props }) => {
  // This will make it so the list will be centred should we have any extra space left over
  const padding = { paddingLeft: bestSpacing.extra / 2, paddingTop: bestSpacing.margin / 2 };

  return (
    <FlatList
      removeClippedSubviews={false}
      data={hits}
      getItemLayout={(data, index) => ({
        length: bestSpacing.height,
        offset: bestSpacing.height * index,
        index,
      })}
      initialNumToRender={10}
      numColumns={bestSpacing.columnCount}
      scrollEnabled
      contentContainerStyle={styles.list}
      renderItem={e => renderItem(e, onPress, bestSpacing, currentUser)}
      style={[styles.container, padding, style]}
      onEndReachedThreshold={0.5}
      {...props}
    />
  );
};

const renderItem = ({ item }, onPress, spacing, currentUser) => {
  let title = null;
  const imageSource = item.image || (item.posterImage || {}).small;

  if (item.titles) {
    title = getComputedTitle(currentUser, item);
  }

  return (
    <View style={{ width: spacing.width, margin: spacing.margin }}>
      <TouchableOpacity onPress={() => onPress(item)}>
        <ProgressiveImage
          source={{ uri: imageSource }}
          style={{
            height: spacing.height,
            width: spacing.width,
            borderRadius: 3,
          }}
        />
        {title && (
          <LinearGradient colors={['transparent', 'black']} style={styles.linearGradient}>
            <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </View>
  );
};

ResultsList.propTypes = {
  hits: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  style: ViewPropTypes.style,
};

ResultsList.defaultProps = {
  style: null,
};

export default ResultsList;
