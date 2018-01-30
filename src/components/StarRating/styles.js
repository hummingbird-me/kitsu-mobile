import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  modalStarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '34%',
  },
  modalRatingText: {
    color: 'rgb(255, 218, 168)',
    fontSize: 40,
    fontFamily: 'OpenSans',
    fontWeight: '700',
    marginLeft: 12,
  },
  modalNoRatingText: {
    color: colors.lightGrey,
    fontSize: 20,
    fontFamily: 'OpenSans',
    fontWeight: '700',
    minHeight: 36,
    textAlignVertical: 'center',
  },
  modalSlider: {
    marginHorizontal: 30,
  },
  textStar: {
    color: colors.yellow,
    fontWeight: '700',
  },
  textNotRated: {
    color: colors.lightGrey,
    fontWeight: '700',
  },
  textAwful: {
    color: colors.red,
    fontWeight: '700',
  },
  textMeh: {
    color: colors.yellow,
    fontWeight: '700',
  },
  textGood: {
    color: colors.green,
    fontWeight: '700',
  },
  textGreat: {
    color: colors.blue,
    fontWeight: '700',
  },
});
