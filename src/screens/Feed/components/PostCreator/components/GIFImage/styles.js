import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    minHeight: 100,
  },
  iconContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 28,
    height: 28,
    borderColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
  icon: {
    color: colors.white,
    fontSize: 14,
  },
});
