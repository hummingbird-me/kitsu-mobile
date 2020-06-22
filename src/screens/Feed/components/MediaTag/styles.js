import { StyleSheet } from 'react-native';
import * as colors from 'app/constants/colors';
import { scenePadding } from 'app/screens/Feed/constants';

export const styles = StyleSheet.create({
  mediaTagView: {
    marginTop: scenePadding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaTag: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.green,
  },
  episodeTagView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeTagLine: {
    height: StyleSheet.hairlineWidth,
    width: 10,
    backgroundColor: colors.green,
  },
});
