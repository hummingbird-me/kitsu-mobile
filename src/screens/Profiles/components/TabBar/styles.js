import { StyleSheet } from 'react-native';
import { offWhite, lightestGrey } from 'kitsu/constants/colors';
import { scenePadding, borderWidth } from 'kitsu/screens/Profiles/constants';

export const styles = StyleSheet.create({
  tab: {
    paddingVertical: scenePadding * 1.25,
    paddingHorizontal: scenePadding,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: offWhite,
    borderTopWidth: borderWidth.hairline,
    borderTopColor: lightestGrey,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
    shadowOpacity: 0.5,
  },
  link: {
    paddingHorizontal: 10,
  },
});
