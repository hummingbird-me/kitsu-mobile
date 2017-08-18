import { darkPurple, white } from 'kitsu/constants/colors';

export default (headerHeight = 64, marginTop = 0) => ({
  headerStyle: { backgroundColor: darkPurple, height: headerHeight },
  headerTitleStyle: {
    color: white,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop,
  },
});
