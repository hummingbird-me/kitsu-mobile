import { StyleSheet } from 'react-native';

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
  backgroundFaderView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
  header: {
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
    marginTop: -11,
    right: 10,
  },
  carousel: {
    flexGrow: 1,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default styles;
