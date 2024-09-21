import { setBackgroundColorAsync, setPositionAsync } from 'expo-navigation-bar';
import { setStatusBarTranslucent } from 'expo-status-bar';
import { Platform } from 'react-native';

export default async function initializeEdgeToEdge(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Promise.allSettled([
    setBackgroundColorAsync('#ffffff00'),
    setPositionAsync('absolute'),
    setStatusBarTranslucent(true),
  ]);
}
