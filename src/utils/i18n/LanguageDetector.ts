import { LanguageDetectorModule } from 'i18next';
import * as Localization from 'expo-localization';

const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  detect: () => Localization.locale,
  init: () => {},
  cacheUserLanguage: () => {},
};
export default languageDetector;
