import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { backgroundColor: '#FAFAFA' },
  linearGradient: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  titleText: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 11,
    fontFamily: 'OpenSans_400Regular',
    padding: 2,
  },
});
