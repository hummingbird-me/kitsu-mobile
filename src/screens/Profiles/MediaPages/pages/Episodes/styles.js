import { StyleSheet } from 'react-native';

import { lightGrey } from 'kitsu/constants/colors';
import { borderWidth } from 'kitsu/screens/Profiles/constants';

export const styles = StyleSheet.create({
  itemSeparator: {
    height: borderWidth.hairline,
    alignSelf: 'stretch',
    backgroundColor: lightGrey,
  },
});
