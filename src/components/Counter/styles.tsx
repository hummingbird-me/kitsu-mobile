import { StyleSheet } from 'react-native';
import { commonStyles } from 'kitsu/common/styles';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 30,
  },
  counterButton: {
    alignItems: 'center',
    backgroundColor: colors.offWhite,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 32,
  },
  counterButtonLeft: {
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  counterButtonRight: {
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  counterStatusContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
    minWidth: 80,
    maxWidth: 80,
  },
  manualEditTextInput: {
    ...StyleSheet.flatten(commonStyles.text),
    borderWidth: 1,
    borderColor: colors.lightGrey,
    color: '#000000',
    padding: 3,
    textAlign: 'center',
  },
  progressText: {
    ...StyleSheet.flatten(commonStyles.text),
    ...StyleSheet.flatten(commonStyles.colorLightGrey),
    fontWeight: '400',
  },
  statusText: {
    ...StyleSheet.flatten(commonStyles.text),
    fontWeight: '400',
  },
});
