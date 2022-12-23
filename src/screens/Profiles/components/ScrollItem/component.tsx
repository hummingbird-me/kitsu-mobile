import React from 'react';
import { View } from 'react-native';
import { scenePadding } from 'kitsu/screens/Profiles/constants';

interface ScrollItemProps {
  spacing?: number;
}

export const ScrollItem = ({
  spacing,
  ...props
}: ScrollItemProps) => (
  <View style={{ marginRight: spacing }} {...props} />
);

ScrollItem.defaultProps = {
  spacing: scenePadding,
};
