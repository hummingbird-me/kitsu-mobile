import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  hide: {
    display: 'none',
  },
  wrapper: {
    flexDirection: 'row',
  },
  selected: {
    marginRight: 4,
  },
  default: {
    marginRight: 4,
    opacity: 0.4,
  },
  modalContent: {
    position: 'absolute',
    backgroundColor: colors.listBackPurple,
    left: 0,
    right: 0,
    bottom: 0,
    height: 250,
  },
  modalContentSimple: {
    position: 'absolute',
    backgroundColor: colors.listBackPurple,
    left: 0,
    right: 0,
    bottom: 0,
    height: 125,
  },
  modalHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxHeight: 46,
    minHeight: 46,
    backgroundColor: colors.listBackPurple,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(46, 34, 45)',
  },
  modalHeaderText: {
    color: colors.white,
    fontWeight: '700',
    fontFamily: 'OpenSans',
    fontSize: 18,
    margin: 10,
  },
  modalCancelButton: {
    color: colors.lightGrey,
  },
  modalDoneButton: {
    color: colors.yellow,
  },
  modalBody: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: colors.listBackPurple,
  },
  modalBodySimple: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: colors.listBackPurple,
  },
  modalStarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '32%',
  },
  modalRatingText: {
    color: 'rgb(255, 218, 168)',
    fontSize: 60,
    fontFamily: 'OpenSans',
    fontWeight: '700',
    marginLeft: 16,
  },
  modalNoRatingText: {
    color: colors.lightGrey,
    fontSize: 30,
    fontFamily: 'OpenSans',
    fontWeight: '700',
    minHeight: 82,
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
