import { darkPurple, white } from 'kitsu/constants/colors';

export default (headerHeight = 64, marginTop = 0, extras = {}) => ({
  headerStyle: {
    backgroundColor: darkPurple,
    height: headerHeight,
    justifyContent: 'center',
  },
  headerTitleStyle: {
    color: white,
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop,
  },
  ...extras,
});
