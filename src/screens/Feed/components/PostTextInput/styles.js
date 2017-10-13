import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Feed/constants';

export const styles = StyleSheet.create({
  postTextInputBox: {
    flex: 1,
  },
  postTextInputField: {
    flex: 1,
    fontFamily: 'Open Sans',
    fontSize: 17,
    paddingHorizontal: scenePadding,
  },
});
