import { StyleSheet } from 'react-native';
import { scenePadding } from 'kitsu/screens/Profiles/constants';

export const styles = StyleSheet.create({
  wrap: {
    paddingTop: scenePadding,
    paddingBottom: scenePadding,
  },
  wrap__dark: {
    backgroundColor: '#FFFFFF',
  },
  list: {
    marginTop: scenePadding,
  },
  listContent: {
    paddingLeft: scenePadding,
    marginLeft: -scenePadding,
  },
});
