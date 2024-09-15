import React from 'react';

import InvariantViolated from '@/errors/InvariantViolated';
import locales from '@/locales';
import { type Locale } from '@/locales/utils/locale';

export const LocaleContext = React.createContext<{
  key: string;
  locale: Locale;
} | null>(null);

export default function LocaleProvider({
  children,
  locale: key,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const locale = locales[key];
  return (
    <LocaleContext.Provider value={{ key, locale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const locale = React.useContext(LocaleContext);
  if (!locale) throw new InvariantViolated('Locale context missing');
  return locale;
}
