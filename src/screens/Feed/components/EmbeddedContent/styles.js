import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  mediaPoster: {
    width: 80,
    height: 120,
  },
  kitsuContent: {
    marginHorizontal: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.lightestGrey,
    backgroundColor: colors.white,
  },
  userPoster: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});
