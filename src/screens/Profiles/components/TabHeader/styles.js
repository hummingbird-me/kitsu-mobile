import { StyleSheet } from 'react-native';
import { scenePadding } from 'kitsu/screens/Profiles/constants';

export const styles = StyleSheet.create({
  wrap: {
    paddingTop: scenePadding,
    paddingBottom: scenePadding,
    paddingHorizontal: scenePadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
