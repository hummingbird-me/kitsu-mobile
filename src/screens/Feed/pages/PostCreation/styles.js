import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const createPostStyles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  errorContainer: {
    padding: 6,
    backgroundColor: '#CC6549',
  },
  uploadProgressContainer: {
    padding: 6,
    backgroundColor: '#16A085',
  },
  tagMedia: {
    margin: 10,
    marginBottom: 5,
  },
  button: {
    margin: 10,
    marginTop: 5,
  },
  checkboxContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flex: 1,
  },
  checkbox: {
    marginRight: 0,
    padding: 8,
  },
  uploadContainer: {
    marginBottom: 10,
  },
});

export const mediaItemStyles = StyleSheet.create({
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
});

export const gifImageStyles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    minHeight: 100,
  },
  iconContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 28,
    height: 28,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
  icon: {
    color: colors.white,
    fontSize: 14,
  },
});

export const additionalButtonStyles = StyleSheet.create({
  container: {
    borderColor: colors.green,
    borderWidth: 1,
    borderRadius: 4,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: colors.green,
    fontSize: 14,
    marginRight: 4,
  },
  text: {
    color: colors.green,
    fontSize: 14,
  },
});
