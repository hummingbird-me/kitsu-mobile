import { capitalize } from 'lodash';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { StyledText } from 'kitsu/components/StyledText';

import { styles } from './styles';

interface LibraryScreenHeaderProps {
  title: string;
  onTitlePress?(...args: unknown[]): unknown;
  onOptionPress?(...args: unknown[]): unknown;
  onSearchPress?(...args: unknown[]): unknown;
}

export const LibraryScreenHeader = ({
  title,
  onTitlePress,
  onOptionPress,
  onSearchPress,
}: LibraryScreenHeaderProps) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerContent}>
      <TouchableOpacity onPress={onTitlePress} style={styles.headerTitle}>
        <StyledText color="light" size="default" bold>
          {capitalize(title)}
        </StyledText>
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

LibraryScreenHeader.defaultProps = {
  onTitlePress: null,
  onOptionPress: null,
  onSearchPress: null,
};
