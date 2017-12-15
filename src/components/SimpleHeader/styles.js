import { StyleSheet } from 'react-native';
import { flattenCommon } from 'kitsu/common/styles';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'flex-end',
    backgroundColor: colors.darkPurple,
    flexDirection: 'row',
    height: 64,
  },
  headerItemText: {
    ...flattenCommon('text'),
    color: colors.lightGrey,
    fontSize: 16,
  },
  headerTitleText: {
    ...flattenCommon('text', 'textHeavy'),
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  leftContainer: {
    marginRight: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  titleContainer: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  rightContainer: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
