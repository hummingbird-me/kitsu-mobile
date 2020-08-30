import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { capitalize } from 'lodash';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StyledText } from 'app/components/StyledText';
import { styles } from './styles';

export default function LibraryScreenHeader({
  title,
  onTitlePress,
  onOptionPress,
  onSearchPress,
}: {
  title: string;
  onTitlePress?: () => any;
  onOptionPress?: () => any;
  onSearchPress?: () => any;
}) {
  const { top, left, right } = useSafeAreaInsets();
  return (
    <View style={styles.headerContainer}>
      <View
        style={[
          styles.headerContent,
          { marginTop: top, marginLeft: left, marginRight: right },
        ]}>
        <TouchableOpacity onPress={onTitlePress} style={styles.headerTitle}>
          <StyledText color="light" size="default" bold>
            {capitalize(title)}
          </StyledText>
          <Ionicons
            name="ios-arrow-down"
            color="white"
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <View style={styles.rightButtons}>
          <TouchableOpacity onPress={onOptionPress} style={styles.rightButton}>
            <Ionicons
              name="ios-options"
              color="white"
              style={styles.rightIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSearchPress} style={styles.rightButton}>
            <Ionicons
              name="ios-search"
              color="white"
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
