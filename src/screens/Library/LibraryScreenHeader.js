import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { capitalize } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import { PropTypes } from 'prop-types';
import { styles } from './styles';

export const LibraryScreenHeader = ({ title, onTitlePress }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={onTitlePress} style={styles.headerTitle}>
      <StyledText color="light" size="default" bold>{capitalize(title)}</StyledText>
      <Icon name="ios-arrow-down" color="white" style={styles.arrowIcon} />
    </TouchableOpacity>
  </View>
);

LibraryScreenHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onTitlePress: PropTypes.func,
};

LibraryScreenHeader.defaultProps = {
  onTitlePress: null,
};

