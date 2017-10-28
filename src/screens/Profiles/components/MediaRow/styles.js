import { StyleSheet } from 'react-native';
import { scenePadding } from 'kitsu/screens/Profiles/constants';

export const styles = StyleSheet.create({
  row: {
    padding: scenePadding,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  main: {
    flex: 1,
    paddingLeft: scenePadding,
  },
});
