import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ICU from 'i18next-icu';

import usePromise from 'app/hooks/usePromise';
import TranslationLoader from 'app/utils/i18n/TranslationLoader';
import LanguageDetector from 'app/utils/i18n/LanguageDetector';

export default function setupI18n() {
  const { state } = usePromise(
    () =>
      i18next
        .use(initReactI18next)
        .use(LanguageDetector)
        .use(TranslationLoader)
        .use(ICU)
        .init({
          interpolation: {
            escapeValue: false,
          },
          react: {
            useSuspense: false,
          },
        }),
    []
  );

  return state === 'fulfilled';
}
