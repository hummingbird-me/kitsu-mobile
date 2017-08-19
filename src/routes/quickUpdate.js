import DismissableStackNavigator from 'kitsu/components/DismissableStackNavigator';
import QuickUpdateScreen from 'kitsu/screens/QuickUpdateScreen';
import navigationOptions from './navigationOptions';

const QuickUpdateStack = DismissableStackNavigator(
  {
    QuickUpdate: {
      screen: QuickUpdateScreen,
    },
  },
  {
    navigationOptions: navigationOptions(50, -10),
  },
);

export default QuickUpdateStack;
