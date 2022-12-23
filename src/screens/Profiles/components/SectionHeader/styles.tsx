import { StyleSheet } from 'react-native';
import { listBackPurple } from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Profiles/constants';

export const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: scenePadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  main: {
    flexDirection: 'row',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 17,
    marginLeft: 7,
    color: '#FFFFFF',
  },

  icon__contentDark: {
    color: listBackPurple,
  },
});
