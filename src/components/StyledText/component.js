import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { listBackPurple, grey, darkGrey, lightGrey, yellow, orange, red, green } from 'kitsu/constants/colors';
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
};

export const StyledText = ({
  size = 'default',
  color = 'dark',
  bold = false,
  textStyle = {},
  ...props
}) => (
  <Text
    style={[
      styles.formattedText,
      {
        fontSize: textSizes[size],
        color: textColors[color],
        fontWeight: bold ? '700' : 'normal',
        lineHeight: textSizes[size] * 1.25,
      },
      textStyle,
    ]}
    {...props}
  />
);

StyledText.propTypes = {
  bold: PropTypes.bool,
  color: PropTypes.oneOf(['light', 'dark', 'grey', 'darkGrey', 'lightGrey', 'yellow', 'orange', 'red', 'green']),
  size: PropTypes.oneOf(['default', 'xxsmall', 'xsmall', 'small', 'large', 'xlarge']),
  textStyle: PropTypes.object,
};

StyledText.defaultProps = {
  bold: false,
  color: 'light',
  size: 'default',
  textStyle: {},
};
