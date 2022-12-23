import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 20,
    borderRadius: 5,
  },
  imageBackground: {
    alignItems: 'center',
  },
  image: {
    marginTop: 50,
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    textAlign: 'center',
    marginVertical: 10,
  }
});
