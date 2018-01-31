import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const HeaderButton = ({ disabled, highlighted, title, onPress, loading }) => (
  <TouchableOpacity
    disabled={disabled}
    style={styles.headerButton}
    onPress={onPress}
  >
    {loading ?
      <ActivityIndicator color={highlighted ? 'yellow' : 'lightGrey'} size="small" />
      :
      <StyledText color={highlighted ? 'yellow' : 'lightGrey'} size="small" bold={highlighted}>{title}</StyledText>
    }
  </TouchableOpacity>
);


HeaderButton.propTypes = {
  disabled: PropTypes.bool,
  title: PropTypes.string,
  highlighted: PropTypes.bool,
  onPress: PropTypes.func,
  loading: PropTypes.bool,
};

HeaderButton.defaultProps = {
  disabled: false,
  title: null,
  highlighted: false,
  onPress: null,
  loading: false,
};
