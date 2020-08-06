import { StyleSheet } from 'react-native';
import { white, softBlack } from 'app/constants/colors';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: white,
    height: 47,
    borderRadius: 8,
    borderColor: white,
    padding: 2,
  },
  input: {
    borderRadius: 4,
    height: 40,
    flex: 1,
    marginLeft: 8,
    backgroundColor: 'transparent',
    fontSize: 14,
    fontFamily: 'OpenSans_400Regular',
    color: softBlack,
  },
});
