import { StyleSheet } from 'react-native';
import { scenePadding } from 'app/screens/Profiles/constants';
import * as colors from 'app/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.listBackPurple,
  },
  tabContainer: {
    flex: 1,
    marginTop: 12,
  },
  tabContainer__light: {
    backgroundColor: '#FFFFFF',
  },
  tabContainer__padded: {
    paddingVertical: 12,
  },
});
