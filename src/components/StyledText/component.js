import React from 'react';
import PropTypes from 'prop-types';
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

export const StyledText = ({
  size,
  color,
  bold,
  textStyle,
  ...props
}) => (
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

StyledText.propTypes = {
  bold: PropTypes.bool,
  color: PropTypes.oneOf(['light', 'dark', 'grey', 'darkGrey', 'lightGrey', 'yellow', 'orange', 'red', 'green', 'black']),
  size: PropTypes.oneOf(['default', 'xxsmall', 'xsmall', 'small', 'large', 'xlarge']),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

StyledText.defaultProps = {
  bold: false,
  color: 'light',
  size: 'default',
  textStyle: null,
};

export const ViewMoreStyledText = ({
  size,
  color,
  bold,
  textStyle,
  disabled,
  ...props
}) => (
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
    {...props}
  />
);

ViewMoreStyledText.propTypes = {
  bold: PropTypes.bool,
  color: PropTypes.oneOf(['light', 'dark', 'grey', 'darkGrey', 'lightGrey', 'yellow', 'orange', 'red', 'green', 'black']),
  size: PropTypes.oneOf(['default', 'xxsmall', 'xsmall', 'small', 'large', 'xlarge']),
  textStyle: PropTypes.object,
  disabled: PropTypes.bool,
};

ViewMoreStyledText.defaultProps = {
  bold: false,
  color: 'light',
  size: 'default',
  textStyle: null,
  disabled: false,
};
