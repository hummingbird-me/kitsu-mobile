import { warmUpAsync } from 'expo-web-browser';
import { Platform } from 'react-native';

export default async function initializeBrowser() {
  if (Platform.OS !== 'android') return;
  await warmUpAsync();
}
