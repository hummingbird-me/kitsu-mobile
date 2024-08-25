import React from 'react';

import InvariantViolated from '@/errors/InvariantViolated';

export const LocaleContext = React.createContext<string | null>(null);

export default function LocaleProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const locale = React.useContext(LocaleContext);
  if (!locale) throw new InvariantViolated('Locale context missing');
  return locale;
}
