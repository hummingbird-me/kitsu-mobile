import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkPurple,
  },
  imageContainer: {
    backgroundColor: colors.offBlack,
  },
  seperator: {
    marginBottom: 8,
  },
  buttonContainer: {
    backgroundColor: colors.offWhite,
    height: 40,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_50: {
    width: '50%',
  },
  icon: {
    fontSize: 24,
    color: colors.darkGrey,
  },
  closeIcon: {
    fontSize: 22,
  },
  sizeIndicatorContainer: {
    position: 'absolute',
    zIndex: 2,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  sizeIndicator: {
    padding: 8,
    fontSize: 14,
    color: 'white',
  },
});
