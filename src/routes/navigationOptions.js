import { darkPurple, white } from 'kitsu/constants/colors';
import { statusBarHeight } from 'kitsu/constants/app';

// The default height, on iOS this will always be 64 (44 + 20)
const defaultHeight = 44 + statusBarHeight;

export default (headerHeight = defaultHeight, marginTop = 0, extras = {}) => ({
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
