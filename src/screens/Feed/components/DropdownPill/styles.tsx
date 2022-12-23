import { StyleSheet } from 'react-native';
import { grey } from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  pillWrap: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderColor: grey,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  arrowIcon: {
    fontSize: 11,
    marginLeft: 6,
  },
});
