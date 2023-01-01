import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

import { ViewMoreText, ViewMoreTextProps } from 'kitsu/components/ViewMoreText';
import {
  black,
  darkGrey,
  green,
  grey,
  lightGrey,
  listBackPurple,
  orange,
  red,
  yellow,
} from 'kitsu/constants/colors';

import { styles } from './styles';

const textSizes = {
  xxsmall: 11,
  xsmall: 13,
  small: 15,
  default: 17,
  large: 20,
  xlarge: 24,
};

const textColors = {
  light: '#FFFFFF',
  dark: listBackPurple,
  grey,
  darkGrey,
  lightGrey,
  yellow,
  orange,
  red,
  green,
  black,
};

type StyledTextProps = TextProps & {
  children: React.ReactNode;
  bold?: boolean;
  color?: keyof typeof textColors;
  size?: keyof typeof textSizes;
  textStyle?: TextStyle;
};

export const StyledText = ({
  size = 'default',
  color = 'light',
  bold = false,
  textStyle,
  ...props
}: StyledTextProps) => (
  <Text
    style={[
      styles.formattedText,
      {
        fontSize: textSizes[size],
        color: textColors[color],
        fontWeight: bold ? '700' : 'normal',
        // Messes up color highlighting of links on Android
        lineHeight: textSizes[size] * 1.25,
      },
      textStyle,
    ]}
    {...props}
  />
);

type ViewMoreStyledTextProps = StyledTextProps &
  ViewMoreTextProps & {
    disabled?: boolean;
    cacheKey?: string;
  };

export const ViewMoreStyledText = ({
  cacheKey,
  size = 'default',
  color = 'light',
  bold = false,
  textStyle,
  ...props
}: ViewMoreStyledTextProps) => (
  <ViewMoreText
    textStyle={[
      styles.formattedText,
      {
        fontSize: textSizes[size],
        color: textColors[color],
        fontWeight: bold ? '700' : 'normal',
        // Messes up color highlighting of links on Android
        lineHeight: textSizes[size] * 1.25,
      },
      textStyle,
    ]}
    cacheKey={cacheKey}
    {...props}
  />
);
