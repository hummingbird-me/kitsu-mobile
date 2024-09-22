import React from 'react';
import { View, type ViewProps } from 'react-native';

import { scenePadding } from '@/screens/Feed/constants';

type RowWrapProps = {
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'flex-end';
} & ViewProps;

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

export const RowMain = ({ style, ...props }: ViewProps) => (
  <View style={[{ flex: 1, paddingLeft: scenePadding }, style]} {...props} />
);
