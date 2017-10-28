import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const HeaderButton = ({ highlighted, title, onPress }) => (
  <TouchableOpacity
    style={styles.headerButton}
    onPress={onPress}
  >
    <StyledText color={highlighted ? 'yellow' : 'lightGrey'} size="small" bold={highlighted}>{title}</StyledText>
  </TouchableOpacity>
);


HeaderButton.propTypes = {
  title: PropTypes.string,
  highlighted: PropTypes.bool,
  onPress: PropTypes.func,
};

HeaderButton.defaultProps = {
  title: null,
  highlighted: false,
  onPress: null,
};
