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
  postHeaderActions: {
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
