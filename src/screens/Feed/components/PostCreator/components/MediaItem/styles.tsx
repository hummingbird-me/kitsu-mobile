import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    // padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    paddingRight: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    borderRadius: 4,
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  icon: {
    color: colors.lightGrey,
    fontSize: 18,
  },
  image: {
    width: 60,
    height: 90,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    overflow: 'hidden',
  },
  image_episode: {
    borderBottomLeftRadius: 0,
  },
  episodeTag: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    padding: 4,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
