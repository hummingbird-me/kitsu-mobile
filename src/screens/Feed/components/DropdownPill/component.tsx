import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { grey } from 'kitsu/constants/colors';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

interface DropdownPillProps {
  title?: string;
  onPress?(...args: unknown[]): unknown;
}

export const DropdownPill = ({
  title,
  onPress
}: DropdownPillProps) => (
  <TouchableOpacity onPress={onPress} style={styles.pillWrap}>
    <StyledText size="xxsmall" color="grey">{title}</StyledText>
    <Icon name="ios-arrow-down" color={grey} style={styles.arrowIcon} />
  </TouchableOpacity>
);

DropdownPill.defaultProps = {
  title: null,
  onPress: null,
};
