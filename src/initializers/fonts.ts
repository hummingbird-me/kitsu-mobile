import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { loadAsync } from 'expo-font';

export default async function initializeFonts() {
  await loadAsync({
    ...FontAwesome.font,
    ...Ionicons.font,
  });
}
