import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { getComputedTitle } from 'kitsu/utils/getTitleField';
import { PropTypes } from 'prop-types';
import { styles } from './styles';

export const ResultsListItem = ({ item, onPress, spacing, currentUser }) => {
  let title = null;
  const imageSource = item.image || (item.posterImage || {}).small;

  if (item.titles) {
    title = getComputedTitle(currentUser, item);
  }

  const bestSpacing = spacing || {};

  const margin = bestSpacing.margin || 0;
  const width = bestSpacing.width || 0;
  const height = bestSpacing.height || 0;

  return (
    <View style={{ width, margin }}>
      <TouchableOpacity onPress={() => onPress(item)}>
        <ProgressiveImage
          source={{ uri: imageSource }}
          style={{
            width,
            height,
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

ResultsListItem.propTypes = {
  item: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  spacing: PropTypes.object,
  currentUser: PropTypes.object,
};

ResultsListItem.defaultProps = {
  onPress: () => null,
  spacing: null,
  currentUser: null,
};
