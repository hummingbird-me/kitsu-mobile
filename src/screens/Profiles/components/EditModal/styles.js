import { StyleSheet, Dimensions } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { coverImageDimensions } from 'kitsu/constants/app';

export const styles = StyleSheet.create({
  profileCoverWrapper: {
    flex: 1,
    marginTop: 10,
  },

  profileCover: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (coverImageDimensions.height / coverImageDimensions.width),
  },

  profileImageWrapper: {
    flex: 1,
    padding: 10,
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
