import {
  useNavigation as _useNavigation,
  useRoute as _useRoute,
} from '@react-navigation/native';

import {
  type LandingNavigatorParamList,
  type LandingNavigatorScreenProps,
} from './LandingNavigator';

export function useNavigation<
  Screen extends keyof LandingNavigatorParamList
>() {
  return _useNavigation<LandingNavigatorScreenProps<Screen>['navigation']>();
}

export function useRoute<Screen extends keyof LandingNavigatorParamList>() {
  return _useRoute<LandingNavigatorScreenProps<Screen>['route']>();
}
