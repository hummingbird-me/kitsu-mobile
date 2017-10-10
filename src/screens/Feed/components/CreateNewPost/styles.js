import { StyleSheet } from 'react-native';
import { scenePadding } from 'kitsu/screens/Feed/constants';

export const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF',
  },
  touchArea: {
    padding: scenePadding,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    paddingLeft: scenePadding,
  },
});
