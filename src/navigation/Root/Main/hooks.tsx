import {
  useNavigation as _useNavigation,
  useRoute as _useRoute,
} from '@react-navigation/native';

import {
  type MainNavigatorParamList,
  type MainNavigatorScreenProps,
} from './MainNavigator';

export function useNavigation<Screen extends keyof MainNavigatorParamList>() {
  const navigation =
    _useNavigation<MainNavigatorScreenProps<Screen>['navigation']>();
  console.log(navigation.getState().key);
  return navigation;
}

export function useRoute<Screen extends keyof MainNavigatorParamList>() {
  return _useRoute<MainNavigatorScreenProps<Screen>['route']>();
}
