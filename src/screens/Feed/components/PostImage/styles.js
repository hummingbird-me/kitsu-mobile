import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    overflow: 'hidden',
  },
});
