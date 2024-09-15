import { type Locale as DateFnsLocale } from 'date-fns';
import React from 'react';

import InvariantViolated from '@/errors/InvariantViolated';

const DateFnsLocaleContext = React.createContext<DateFnsLocale | null>(null);

export default function DateFnsLocaleProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: DateFnsLocale;
}) {
  return (
    <DateFnsLocaleContext.Provider value={locale}>
      {children}
    </DateFnsLocaleContext.Provider>
  );
}

export function useDateFnsLocale() {
  const locale = React.useContext(DateFnsLocaleContext);
  if (!locale) throw new InvariantViolated('DateFnsLocale context missing');
  return locale;
}
