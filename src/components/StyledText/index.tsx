import React from 'react';
import { Text, TextProps } from 'react-native';
import {
  listBackPurple,
  grey,
  darkGrey,
  lightGrey,
  yellow,
  orange,
  red,
  green,
  black,
} from 'app/constants/colors';
import { ViewMoreText } from 'app/components/ViewMoreText';
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

type StyledTextProps = {
  bold?: boolean;
  color?: keyof typeof textColors;
  size?: keyof typeof textSizes;
} & TextProps;

export const StyledText = ({
  size = 'default',
  color = 'light',
  bold = false,
  style,
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
      style,
    ]}
    {...props}
  />
);

type ViewMoreStyledTextProps = StyledTextProps & {
  cacheKey?: string;
  disabled?: boolean;
};

export const ViewMoreStyledText = ({
  cacheKey,
  size = 'default',
  color = 'light',
  bold = false,
  style,
  disabled = false,
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
      style,
    ]}
    cacheKey={cacheKey}
    {...props}
  />
);
