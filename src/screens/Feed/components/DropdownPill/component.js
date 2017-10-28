import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { grey } from 'kitsu/constants/colors';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const DropdownPill = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.pillWrap}>
    <StyledText size="xxsmall" color="grey">{title}</StyledText>
    <Icon name="ios-arrow-down" color={grey} style={styles.arrowIcon} />
  </TouchableOpacity>
);

DropdownPill.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
};
DropdownPill.defaultProps = {
  title: null,
  onPress: null,
};
