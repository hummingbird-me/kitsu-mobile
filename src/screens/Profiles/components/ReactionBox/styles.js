import { StyleSheet } from 'react-native';
import { lightGrey, grey } from 'kitsu/constants/colors';
import { scenePadding, cardSize, borderWidth } from 'kitsu/screens/Profiles/constants';

export const styles = StyleSheet.create({
  wrap: {
    padding: scenePadding,
    backgroundColor: '#FFFFFF',
  },
  wrap__boxed: {
    borderRadius: 6,
    width: cardSize.landscapeLarge.width,
    height: cardSize.landscapeLarge.height,
  },
  main: {
    marginTop: scenePadding,
  },
  voteBox: {
    paddingHorizontal: scenePadding / 2,
    paddingVertical: 0,
    borderRadius: 4,
    borderWidth: borderWidth.hairline,
    borderColor: lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteIcon: {
    fontSize: 19,
    color: grey,
    marginRight: 5,
  },
});
