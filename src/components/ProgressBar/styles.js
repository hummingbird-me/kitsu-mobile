import { StyleSheet } from 'react-native';

import * as colors from 'kitsu/constants/colors';

const styles = StyleSheet.create({
  outer: {
    borderRadius: 4,
    height: 4,
    margin: 3,
    backgroundColor: colors.lightGrey,
  },
  inner: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: colors.lightGreen,
  },
});

export default styles;
