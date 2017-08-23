import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: colors.listBackPurple,
    paddingTop: 77,
  },
  hintText: {
    fontFamily: 'OpenSans',
    fontSize: 10,
    marginLeft: 8,
    color: colors.lightGrey,
  },
  valueText: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    marginLeft: 8,
    marginTop: 4,
    color: '#444',
  },
  fieldWrapper: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  fieldText: {
    fontSize: 10,
    color: 'grey',
    fontFamily: 'OpenSans',
  },
  fieldInput: {
    marginTop: 4,
    height: 30,
    fontFamily: 'OpenSans',
    fontSize: 14,
  },
  selectMenu: {
    backgroundColor: colors.white,
    padding: 8,
  },
});

export default styles;
