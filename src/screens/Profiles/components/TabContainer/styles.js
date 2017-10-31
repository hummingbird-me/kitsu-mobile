import { StyleSheet } from 'react-native';
import { scenePadding } from 'kitsu/screens/Profiles/constants';

export const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    marginTop: scenePadding,
  },
  tabContainer__light: {
    backgroundColor: '#FFFFFF',
  },
  tabContainer__padded: {
    paddingVertical: scenePadding,
  },
});
