import { StyleSheet } from 'react-native';

import * as colors from 'kitsu/constants/colors';

const text = {
  color: colors.white,
  fontFamily: 'OpenSans',
  fontSize: 16,
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
  },
  headerText: {
    flex: 1,
    ...text,
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: '700',
  },
  headerButton: {
    justifyContent: 'center',
  },
  headerButtonText: {
    ...text,
    textAlign: 'center',
    alignSelf: 'center',
    color: colors.lightGrey,
    fontWeight: '600',
  },
  wrapper: {
    flex: 1,
  },
  editorWrapper: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 10,
  },
  editor: {
    ...text,
    color: 'black',
  },
});

export default styles;
