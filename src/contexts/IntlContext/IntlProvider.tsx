import { OnErrorFn } from '@formatjs/intl';
import Constants from 'expo-constants';
import React from 'react';
import {
  MessageFormatElement,
  IntlProvider as ReactIntlProvider,
} from 'react-intl';

// Swallow missing translation errors in development mode
const onError: OnErrorFn | undefined = Constants.debugMode
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
