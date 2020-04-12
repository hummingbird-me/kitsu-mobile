import I18n from "i18n-js";
import * as RNLanguages from "react-native-languages";

import en from "./en";
import es from "./es";

const locales = RNLanguages.language;

I18n.locale = locales;

I18n.fallbacks = true;
I18n.translations = {
  en,
  es
};

export default I18n;
