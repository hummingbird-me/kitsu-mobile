import { StyleSheet } from 'react-native';

import * as colors from 'kitsu/constants/colors';

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 8,
    marginVertical: 2,
    fontSize: 24,
    color: colors.white,
  },
});

export default styles;
