import { StyleSheet } from 'react-native';
import * as colors from 'app/constants/colors';

export default StyleSheet.create({
  typeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    height: 5000,
  },
  opacityFill: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
  },
  typeSelectContainer: {
    backgroundColor: colors.purple,
  },
  typeTextContainer: {
    zIndex: 20,
    borderBottomColor: colors.darkPurple,
    borderBottomWidth: 1,
    padding: 14,
    justifyContent: 'center',
  },
  typeText: {
    textAlignVertical: 'center',
  },
});
