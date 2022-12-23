import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  anchorBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  posterImageContainer: {
    marginRight: 4,
    borderRadius: 3,
    overflow: 'hidden',
  },
  posterImageCard: {
    backgroundColor: colors.lightPurple,
    marginBottom: 2,
  },
  linearGradient: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subheading: {
    fontFamily: 'OpenSans',
    backgroundColor: 'transparent',
    textAlign: 'center',
    flex: 1,
    fontWeight: '200',
    fontSize: 13,
    color: '#000',
  },
});
