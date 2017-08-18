import { Dimensions } from 'react-native';
import * as colors from '../../../constants/colors';

export const styles = {
  container: {
    alignItems: 'center',
    backgroundColor: colors.darkPurple,
    justifyContent: 'center',
    borderWidth: 0,
  },
  coverImage: {
    width: Dimensions.get('window').width,
    height: 125,
    backgroundColor: '#fff0',
  },
  customHeader: {
    alignSelf: 'stretch',
    flex: 1,
    height: 85,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  posterImageCard: {
    width: 105,
    height: 155,
    marginLeft: 4,
    marginRight: 4,
  },
};
