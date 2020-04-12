import I18n from "i18n-js";
import * as RNLanguages from "react-native-languages";

import en from "kitsu/translations/en.json";
import es from "kitsu/translations/es.json";

const locales = RNLanguages.getLocales();

if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageTag;
}

I18n.fallbacks = true;

I18n.translation = {
  en,
  es
};

export default I18n;
