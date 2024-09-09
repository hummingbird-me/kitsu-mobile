import {
  useNavigation as _useNavigation,
  useRoute as _useRoute,
} from '@react-navigation/native';

import {
  type RootNavigatorParamList,
  type RootNavigatorScreenProps,
} from './RootNavigator';

export function useNavigation<Screen extends keyof RootNavigatorParamList>() {
  return _useNavigation<RootNavigatorScreenProps<Screen>['navigation']>();
}

export function useRoute<Screen extends keyof RootNavigatorParamList>() {
  return _useRoute<RootNavigatorScreenProps<Screen>['route']>();
}
