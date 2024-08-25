import { useLocales } from 'expo-localization';
import { availableLocales } from 'preferred-locale';
import React from 'react';

import BaseError from '@/errors/base';
import usePromise from '@/hooks/usePromise';
import translations from '@/locales';

import DateFnsLocaleProvider from './DateFnsLocaleContext';
import IntlProvider from './IntlProvider';
import LocaleProvider from './LocaleContext';

export class IntlLoadError extends BaseError {
  static name = 'IntlLoadError';
}

function useResolvedLocale() {
  const userLocales = useLocales().map((locale) => locale.languageTag);
  const appLocales = Object.keys(translations);
  const locale = availableLocales(userLocales, appLocales)[0] ?? 'en-US';

  return locale;
}

/**
 * Resolves the user's preferred locale and loads the corresponding translations.
 * Does not render children until translations are loaded.
 */
export default function IntlContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useResolvedLocale();
  const {
    state,
    error,
    value: data,
  } = usePromise(translations[locale].load, [locale]);

  if (state === 'pending') {
    return null;
  } else if (state === 'rejected') {
    throw new IntlLoadError('Intl load rejected', { cause: error });
  } else if (data === undefined) {
    throw new IntlLoadError('Intl data was empty');
  } else {
    return (
      <LocaleProvider locale={locale}>
        <IntlProvider locale={locale} messages={data.kitsu}>
          <DateFnsLocaleProvider locale={data.dateFns}>
            {children}
          </DateFnsLocaleProvider>
        </IntlProvider>
      </LocaleProvider>
    );
  }
}
