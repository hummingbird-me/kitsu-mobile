import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSimpleShadow: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    zIndex: 99,
    marginHorizontal: 3,
  },
  imageSimple: {
    width: 54,
    height: 54,
    resizeMode: 'contain',
    marginHorizontal: 3,
  },
  imageSimpleShadowBackground: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
