import { StyleSheet } from 'react-native';
import { offWhite, lightestGrey } from 'kitsu/constants/colors';
import { scenePadding, borderWidth } from 'kitsu/screens/Profiles/constants';

export const styles = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    paddingVertical: scenePadding * 1.25,
    paddingHorizontal: scenePadding,
    backgroundColor: offWhite,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: borderWidth.hairline,
    borderTopColor: lightestGrey,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
  },
});
