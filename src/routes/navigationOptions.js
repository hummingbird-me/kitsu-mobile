import { darkPurple, white } from 'kitsu/constants/colors';
import { navigationBarHeight, statusBarHeight } from 'kitsu/constants/app';
import { isX, paddingX } from 'kitsu/utils/isX';

// The default height, on iOS this will always be 64 (44 + 20)
const defaultHeight = navigationBarHeight + statusBarHeight + (isX ? paddingX : 0);

export default (headerHeight = defaultHeight, marginTop = 0, extras = {}) => ({
  headerStyle: {
    backgroundColor: darkPurple,
    height: headerHeight,
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
