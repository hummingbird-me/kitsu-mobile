import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '60%',
  },
  gradient__top: {
    top: -1,
  },
  gradient__bottom: {
    bottom: -1,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  imageView: {
    width: '100%',
    height: '100%',
  },
});
