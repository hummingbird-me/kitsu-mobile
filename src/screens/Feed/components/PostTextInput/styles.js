import { StyleSheet } from 'react-native';
import { scenePadding } from 'app/screens/Feed/constants';

export const styles = StyleSheet.create({
  postTextInputBox: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  postTextInputField: {
    width: '100%',
    fontFamily: 'OpenSans_400Regular',
    fontSize: 17,
    paddingHorizontal: scenePadding,
    textAlignVertical: 'top',
  },
});
