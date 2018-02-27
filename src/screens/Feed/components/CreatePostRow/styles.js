import { StyleSheet, Dimensions } from 'react-native';
import { scenePadding } from 'kitsu/screens/Feed/constants';

export const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF',
    padding: scenePadding,
    minWidth: Dimensions.get('window').width,
  },
});
