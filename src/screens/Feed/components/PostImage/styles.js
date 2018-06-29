import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

const absouluteFill = {
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,
  overflow: 'hidden',
};

export const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  loadingContainer: {
    ...absouluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  gifOverlay: {
    ...absouluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  gifOverlayTextContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifOverlayText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});
