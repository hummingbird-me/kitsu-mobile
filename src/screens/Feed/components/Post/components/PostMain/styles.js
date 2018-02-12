import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Feed/constants';

export const styles = StyleSheet.create({
  postMain: {
    paddingHorizontal: scenePadding,
    paddingVertical: scenePadding / 2,
  },
  postImagesView: {
    marginTop: 12,
    marginLeft: scenePadding * -1,
    marginRight: scenePadding * -1,
  },
  postImagesView_noText: {
    marginTop: 0,
  },
  linkStyle: {
    color: colors.orange,
    fontStyle: 'italic',
  },
});
