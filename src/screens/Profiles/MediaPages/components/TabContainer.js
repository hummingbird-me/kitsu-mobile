import glamorous from 'glamorous-native';
import { scenePadding } from '../constants';

const TabContainer = glamorous.view(
  {
    flex: 1,
    marginTop: scenePadding,
  },
  ({ light, padded }) => ({
    backgroundColor: light ? '#FFFFFF' : 'auto',
    paddingVertical: padded ? scenePadding : 0,
  }),
);

export default TabContainer;
