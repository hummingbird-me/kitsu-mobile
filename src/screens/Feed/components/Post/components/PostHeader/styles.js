import { StyleSheet } from 'react-native';
import { scenePadding } from 'kitsu/screens/Feed/constants';

export const styles = StyleSheet.create({
  postHeader: {
    paddingHorizontal: scenePadding,
    paddingVertical: scenePadding / 2,
  },
  postHeaderBackButton: {
    marginLeft: -scenePadding,
    padding: scenePadding,
  },
  userDetailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
