import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { capitalize } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import { PropTypes } from 'prop-types';
import { styles } from './styles';

export const LibraryScreenHeader = ({ title, onTitlePress, onOptionPress, onSearchPress }) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerContent}>
      <TouchableOpacity onPress={onTitlePress} style={styles.headerTitle}>
        <StyledText color="light" size="default" bold>{capitalize(title)}</StyledText>
        <Icon name="ios-arrow-down" color="white" style={styles.arrowIcon} />
      </TouchableOpacity>
      <View style={styles.rightButtons}>
        <TouchableOpacity onPress={onOptionPress} style={styles.rightButton}>
          <Icon name="ios-options" color="white" style={styles.rightIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSearchPress} style={styles.rightButton}>
          <Icon name="ios-search" color="white" style={styles.rightIcon} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

LibraryScreenHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onTitlePress: PropTypes.func,
  onOptionPress: PropTypes.func,
  onSearchPress: PropTypes.func,
};

LibraryScreenHeader.defaultProps = {
  onTitlePress: null,
  onOptionPress: null,
  onSearchPress: null,
};

