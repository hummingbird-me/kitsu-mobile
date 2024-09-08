import { Platform } from 'react-native';

export const OpenSans = {
  normal: Platform.select({
    android: 'OpenSans_400Regular',
    ios: 'OpenSans',
  }),
  semibold: Platform.select({
    android: 'OpenSans_600SemiBold',
    ios: 'OpenSans-SemiBold',
  }),
  bold: Platform.select({
    android: 'OpenSans_700Bold',
    ios: 'OpenSans-Bold',
  }),
};

export const Asap = {
  bold: Platform.select({
    android: 'Asap_700Bold',
    ios: 'Asap-Bold',
  }),
};
