import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { Asap_700Bold } from '@expo-google-fonts/asap';

export default function loadFonts() {
  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
    Asap_700Bold,
  });

  return fontsLoaded;
}
