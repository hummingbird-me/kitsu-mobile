import { StyleSheet } from 'react-native';
import { isX, paddingX } from 'kitsu/utils/isX';

export const styles = StyleSheet.create({
  sceneContainer: {
    flex: 1,
    position: 'relative',
    paddingTop: isX ? paddingX : 0,
  },
});
