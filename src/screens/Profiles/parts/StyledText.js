import React from 'react';
import glamorous from 'glamorous-native';
import { listBackPurple, grey, darkGrey, lightGrey, yellow } from 'kitsu/constants/colors';

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
};

const StyledText = glamorous.text(
  {
    fontFamily: 'OpenSans',
    backgroundColor: 'transparent',
  },
  ({ size, color, bold, capitalize }) => ({
    fontSize: textSizes[size],
    lineHeight: textSizes[size] * 1.25,
    color: textColors[color],
    fontWeight: bold ? '700' : 'normal',
    textTransform: capitalize ? 'capitalize' : 'none',
  })
);

export default ({
  size = 'default',
  color = 'dark',
  bold = false,
  capitalize = false,
  ...props
}) => <StyledText size={size} color={color} bold={bold} capitalize={capitalize} {...props} />;
