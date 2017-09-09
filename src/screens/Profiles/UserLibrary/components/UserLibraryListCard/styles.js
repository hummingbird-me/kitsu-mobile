import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { commonStyles } from 'kitsu/common/styles';

const MENU_BUTTON_WIDTH = 24;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
    flexDirection: 'row',
    padding: 10,
  },
  content: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  menuButton: {
    width: MENU_BUTTON_WIDTH,
  },
  menuButtonContainer: {
    marginLeft: 'auto',
  },
  posterImage: {
    borderRadius: 4,
  },
  progressBarBackground: {
    backgroundColor: colors.lightGrey,
  },
  progressContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  ratingStyle: {
    marginLeft: 10,
  },
  statusSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  swipeButton: {
    alignContent: 'flex-start',
    paddingLeft: 12,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
  swipeButtonActive: {
    backgroundColor: colors.green,
  },
  swipeButtonInactive: {
    backgroundColor: colors.darkGrey,
  },
  swipeButtonText: {
    ...StyleSheet.flatten(commonStyles.text),
    ...StyleSheet.flatten(commonStyles.colorWhite),
    fontSize: 16,
  },
  titleSection: {
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  titleText: {
    ...StyleSheet.flatten(commonStyles.text),
    marginRight: MENU_BUTTON_WIDTH + 2, // for padding
  },
});
