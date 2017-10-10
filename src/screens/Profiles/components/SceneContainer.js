import glamorous from 'glamorous-native';
import { listBackPurple } from 'kitsu/constants/colors';

const SceneContainer = glamorous.view(
  {
    flex: 1,
    position: 'relative',
  },
  ({ backgroundColor }) => ({ backgroundColor: backgroundColor || listBackPurple }),
);

export default SceneContainer;
