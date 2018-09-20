import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { flatten } from '../styles';

export const styles = StyleSheet.create({
  containerStyle: flatten('containerStyle'),
  hintText: flatten('hintText'),
  valueText: flatten('valueText'),
  selectMenu: flatten('selectMenu'),
  item: flatten('item'),
  itemImage: flatten('itemImage'),
  itemLogo: {
    width: 100,
    height: 24,
    resizeMode: 'contain',
  },
  card: {
    backgroundColor: colors.white,
    padding: 2,
    borderRadius: 4,
    marginHorizontal: 12,
    marginVertical: 20,
  },
  cardText: {
    textAlign: 'center',
    paddingHorizontal: 12,
    fontFamily: 'OpenSans',
    fontSize: 12,
  },
  cardLogo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  inputWrapper: {
    flexDirection: 'row',
  },
  input: {
    ...flatten('input'),
    textAlign: 'center',
    height: 50,
    fontSize: 16,
  },
  modalTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 14,
  },
  modalText: {
    textAlign: 'center',
    paddingHorizontal: 12,
    fontFamily: 'OpenSans',
    fontSize: 12,
  },
});
