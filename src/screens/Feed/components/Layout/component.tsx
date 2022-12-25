import React from 'react';
import { View, ViewStyle } from 'react-native';

import { scenePadding } from 'kitsu/screens/Feed/constants';

interface RowWrapProps {
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'flex-end';
  style?: ViewStyle;
}

export const RowWrap = ({
  alignItems = 'flex-start',
  justifyContent = 'flex-start',
  style,
  ...props
}: RowWrapProps) => (
  <View
    style={[
      {
        flexDirection: 'row',
        alignItems,
        justifyContent,
      },
      style,
    ]}
    {...props}
  />
);

interface RowMainProps {
  style?: ViewStyle;
}

export const RowMain = ({ style, ...props }: RowMainProps) => (
  <View style={[{ flex: 1, paddingLeft: scenePadding }, style]} {...props} />
);
