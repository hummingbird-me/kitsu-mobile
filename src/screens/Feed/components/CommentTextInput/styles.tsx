import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Feed/constants';

export const styles = StyleSheet.create({
  textInputBox: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    borderRadius: 20,
    minHeight: 36,
    // We have a bigger height for android
    // Because there is a bug with the textfield where it won't allow
    // users to scroll if max height has been reached :/
    // Might be fixable by upgrading RN
    // see: https://github.com/facebook/react-native/issues/12799#issuecomment-317864934
    maxHeight: Platform.select({ ios: 100, android: 180 }),
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  textInputField: {
    flex: 1,
    fontFamily: 'Open Sans',
    fontSize: 13,
    paddingHorizontal: scenePadding,
    paddingVertical: 4,
    minHeight: 30,
    textAlignVertical: 'center',
  },
  submitButton: {
    height: 36,
    paddingVertical: 5,
    paddingLeft: scenePadding * 2,
  },
  submitButtonIcon: {
    fontSize: 24,
  },
  gifButton: {
    marginLeft: 6,
    marginRight: 8,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 16,
  },
  gifText: {
    color: colors.grey,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
