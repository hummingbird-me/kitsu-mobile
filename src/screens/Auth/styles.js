import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkPurple,
  },
  stretch: {
    flex: 1,
  },
  logo: {
    position: 'absolute',
    bottom: 40,
    width: 150,
    height: 42,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  tabsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.offBlack,
  },
  tab: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    textAlign: 'center',
    color: colors.transparentWhite,
    fontWeight: 'bold',
  },
  formsWrapper: {
    marginVertical: 8,
  },
});
