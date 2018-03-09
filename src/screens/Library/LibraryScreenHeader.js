import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { capitalize } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';

export const LibraryScreenHeader = ({ type }) => (
  <View style={styles.headerContainer}>
    <StyledText color="light" size="default" bold>{capitalize(type)}</StyledText>
    <Icon name="ios-arrow-down" color="white" style={styles.arrowIcon} />
  </View>
);
