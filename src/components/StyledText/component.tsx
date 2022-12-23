import React from 'react';
import { Text } from 'react-native';
import { listBackPurple, grey, darkGrey, lightGrey, yellow, orange, red, green, black } from 'kitsu/constants/colors';
import { ViewMoreText } from 'kitsu/components/ViewMoreText';
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

interface StyledTextProps {
  bold?: boolean;
  color?: "light" | "dark" | "grey" | "darkGrey" | "lightGrey" | "yellow" | "orange" | "red" | "green" | "black";
  size?: "default" | "xxsmall" | "xsmall" | "small" | "large" | "xlarge";
  textStyle?: object | number;
}

export const StyledText = ({
  size,
  color,
  bold,
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

StyledText.defaultProps = {
  bold: false,
  color: 'light',
  size: 'default',
  textStyle: null,
};

interface ViewMoreStyledTextProps {
  bold?: boolean;
  color?: "light" | "dark" | "grey" | "darkGrey" | "lightGrey" | "yellow" | "orange" | "red" | "green" | "black";
  size?: "default" | "xxsmall" | "xsmall" | "small" | "large" | "xlarge";
  textStyle?: object;
  disabled?: boolean;
  cacheKey?: string;
}

export const ViewMoreStyledText = ({
  cacheKey,
  size,
  color,
  bold,
  textStyle,
  disabled,
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

ViewMoreStyledText.defaultProps = {
  bold: false,
  color: 'light',
  size: 'default',
  textStyle: null,
  disabled: false,
  cacheKey: null,
};
