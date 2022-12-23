import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

import { StyledText } from 'kitsu/components/StyledText';

import { styles } from './styles';

interface HeaderButtonProps {
  disabled?: boolean;
  title?: string;
  highlighted?: boolean;
  onPress?(...args: unknown[]): unknown;
  loading?: boolean;
  style?: object;
  textStyle?: object;
}

export const HeaderButton = ({
  disabled,
  highlighted,
  title,
  onPress,
  loading,
  style,
  textStyle,
  ...other
}: HeaderButtonProps) => (
  <TouchableOpacity
    {...other}
    disabled={disabled}
    style={[styles.headerButton, style]}
    onPress={onPress}
  >
    {loading ? (
      <ActivityIndicator
        color={highlighted ? 'yellow' : 'lightGrey'}
        size="small"
      />
    ) : (
      <StyledText
        color={highlighted ? 'yellow' : 'lightGrey'}
        size="small"
        bold={highlighted}
        textStyle={textStyle}
      >
        {title}
      </StyledText>
    )}
  </TouchableOpacity>
);

HeaderButton.defaultProps = {
  disabled: false,
  title: null,
  highlighted: false,
  onPress: null,
  loading: false,
  style: null,
  textStyle: null,
};
