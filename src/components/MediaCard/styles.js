import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { flattenCommon } from 'kitsu/common/styles';

export const styles = StyleSheet.create({
  captionText: {
    ...flattenCommon('text'),
    textAlign: 'center',
    fontSize: 10,
  },
  posterImageContainer: {
    marginRight: 4,
    borderRadius: 3,
    overflow: 'hidden',
  },
  posterImageCard: {
    backgroundColor: colors.lightPurple,
    marginBottom: 2,
    borderRadius: 3,
  },
  progressBar: {
    marginTop: 2,
  },
  rating: {
    marginTop: 2,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
