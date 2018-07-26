import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { isTablet } from 'react-native-device-info';

export const styles = StyleSheet.create({
  tag: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    color: colors.white,
    fontSize: isTablet ? 13 : 11,
    fontWeight: 'bold',
  },
});
