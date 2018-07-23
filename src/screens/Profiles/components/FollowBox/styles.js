import { StyleSheet } from 'react-native';
import { scenePadding } from 'kitsu/screens/Feed/constants';

export const styles = StyleSheet.create({
  followBox: {
    paddingHorizontal: scenePadding,
    paddingVertical: scenePadding / 2,
    backgroundColor: '#FFFFFF',
  },
  followBoxBackButton: {
    marginLeft: -scenePadding,
    padding: scenePadding,
  },
  followBoxActions: {
    fontSize: 32,
    paddingVertical: 10,
    paddingLeft: 15,
  },
  userDetailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});

