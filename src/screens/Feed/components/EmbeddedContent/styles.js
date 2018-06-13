import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  mediaPoster: {
    width: 80,
    height: 120,
  },
  kitsuContent: {
    marginHorizontal: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.lightestGrey,
    backgroundColor: colors.white,
  },
  userPoster: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  dataSaver: {
    backgroundColor: colors.darkPurple,
    flex: 1,
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  dataBunny: {
    height: 135,
    width: 80,
  },
  dataSaverTextContainer: {
    height: '100%',
    justifyContent: 'center',
    marginLeft: 8,
    paddingLeft: 8,
  },
});
