import { StyleSheet } from 'react-native';
import * as colors from 'app/constants/colors';

export const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.purple,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    elevation: 3,
  },
  headerContent: {
    height: 44,
    width: '100%',
    overflow: 'hidden',
  },
  headerTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 4,
  },
  arrowIcon: {
    fontSize: 14,
    paddingTop: 2,
    marginLeft: 6,
  },

  rightButtons: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    right: 8,
    flexDirection: 'row',
  },
  rightButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  rightIcon: {
    fontSize: 22,
  },
});
