import { StyleSheet } from 'react-native';
import { isX } from 'kitsu/utils/isX';
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
    marginTop: isX ? 20 : 0,
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: '700',
  },
  headerButton: {
    marginTop: isX ? 20 : 0,
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  addGIF: {
    margin: 10,
    marginTop: 5,
  },
  gifWrapper: {
    marginTop: 5,
    marginHorizontal: -10,
  },
  checkboxContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  checkbox: {
    marginRight: 0,
    padding: 8,
  },
});

export default styles;
