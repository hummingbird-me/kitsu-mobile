import * as Sentry from '@sentry/react-native';

export default async function initializeSentry() {
  if (__DEV__) return;

  Sentry.init({
    dsn: 'https://068b9ab849bf4485beb4884adcc5be83:8c57373b9bb4410f99ebfd17878c739a@sentry.io/200469',
  });
}
