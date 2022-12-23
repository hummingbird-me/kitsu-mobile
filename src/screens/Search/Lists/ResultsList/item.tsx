import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { getComputedTitle } from 'kitsu/utils/getTitleField';

import { styles } from './styles';

interface ResultsListItemProps {
  item: object;
  onPress?(...args: unknown[]): unknown;
  spacing?: object;
  currentUser?: object;
}

export const ResultsListItem = ({
  item,
  onPress,
  spacing,
  currentUser,
}: ResultsListItemProps) => {
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
          <LinearGradient
            colors={['transparent', 'black']}
            style={styles.linearGradient}
          >
            <Text
              style={styles.titleText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </View>
  );
};

ResultsListItem.defaultProps = {
  onPress: () => null,
  spacing: null,
  currentUser: null,
};
