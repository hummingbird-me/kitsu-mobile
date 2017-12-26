import { StyleSheet, Platform } from 'react-native';
import { isX } from 'kitsu/utils/isX';

import * as colors from 'kitsu/constants/colors';

const styles = StyleSheet.create({
  loadingWrapper: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    flexGrow: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  faderCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    marginTop: Platform.select({ ios: 0, android: 20 }),
    paddingTop: isX ? 30 : 0,
    height: 70,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center',
    color: colors.white,
    fontFamily: 'OpenSans',
    fontWeight: '700',
    fontSize: 16,
  },
  filterButton: {
    position: 'absolute',
    top: '50%',
    marginTop: isX ? 20 : -11,
    right: 10,
  },
  carousel: {
    flexGrow: 1,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
});

export default styles;
