import React from 'react';
import { View } from 'react-native';
import { scenePadding } from 'kitsu/screens/Feed/constants';

interface RowWrapProps {
  alignItems?: "flex-start" | "center" | "flex-end";
  justifyContent?: "flex-start" | "center" | "space-between" | "space-around" | "flex-end";
  style?: object;
}

export const RowWrap = ({
  alignItems,
  justifyContent,
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
  style?: object;
}

export const RowMain = ({
  style,
  ...props
}: RowMainProps) => (
  <View
    style={[
      { flex: 1, paddingLeft: scenePadding },
      style,
    ]}
    {...props}
  />
);

RowWrap.defaultProps = {
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  style: {},
};

RowMain.defaultProps = {
  style: {},
};
