import { type OnErrorFn } from '@formatjs/intl';
import React from 'react';
import {
  IntlProvider as ReactIntlProvider,
  type MessageFormatElement,
} from 'react-intl';

// Swallow missing translation errors in development mode
const onError: OnErrorFn | undefined = __DEV__
  ? (err) => {
      if (err.code === 'MISSING_TRANSLATION') return;
      throw err;
    }
  : undefined;

export default function IntlProvider({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, MessageFormatElement[]>;
}) {
  return (
    <ReactIntlProvider locale={locale} messages={messages} onError={onError}>
      {children}
    </ReactIntlProvider>
  );
}
