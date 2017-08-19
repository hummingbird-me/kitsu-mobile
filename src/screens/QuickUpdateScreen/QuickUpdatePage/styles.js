import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    alignItems: 'center',
    minWidth: Dimensions.get('window').width * 0.85,
    marginBottom: 60,
  },
  shadow: {
    // Android
    elevation: 2,

    // iOS
    shadowColor: 'black',
    shadowRadius: 3,
    shadowOpacity: 0.4,
    shadowOffset: {
      height: 2,
    },
  },
  posterImageWrapper: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    height: 200,
    borderRadius: 10,
    
    zIndex: 4,
  },
  posterImage: {
    flexGrow: 1,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  cardWrapper: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,

    zIndex: 3,
  },
  cardContent: {
    marginTop: 100,
  },
});

export default styles;
