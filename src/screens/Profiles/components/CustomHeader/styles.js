import { StyleSheet } from 'react-native';
import { scenePadding } from 'kitsu/screens/Profiles/constants';
import { statusBarHeight, navigationBarHeight } from 'kitsu/constants/app';
import { isX, paddingX } from 'kitsu/utils/isX';

export const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: statusBarHeight + (isX ? paddingX : 0),
    height: navigationBarHeight + statusBarHeight + (isX ? paddingX : 0),
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 99,
  },
  buttonView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: navigationBarHeight,
  },
  buttonView__left: {
    justifyContent: 'flex-start',
  },
  buttonView__right: {
    justifyContent: 'flex-end',
  },
  button: {
    padding: scenePadding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    color: '#FFFFFF',
    fontSize: 28,
  },
  buttonTitle: {
    marginLeft: 6,
    lineHeight: 17,
  },
  titleView: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
