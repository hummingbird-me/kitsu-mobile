import * as Sentry from 'sentry-expo';

export function init() {
  if (!__DEV__) {
    Sentry.init({
      dsn:
        'https://068b9ab849bf4485beb4884adcc5be83@o55600.ingest.sentry.io/200469',
      enableInExpoDevelopment: false,
      debug: true,
    });
  }
}

export function log(message: string, data: {} = {}) {
  if (__DEV__) {
    console.log(message, data);
  } else {
    Sentry.addBreadcrumb({
      category: 'log',
      level: Sentry.Severity.Log,
      message,
      data,
    });
  }
}

export function info(message: string, data: {} = {}) {
  if (__DEV__) {
    console.info(message, data);
  } else {
    Sentry.addBreadcrumb({
      category: 'log',
      level: Sentry.Severity.Info,
      message,
      data,
    });
  }
}

export function debug(message: string, data: {} = {}) {
  if (__DEV__) {
    console.debug(message, data);
  } else {
    Sentry.addBreadcrumb({
      category: 'log',
      level: Sentry.Severity.Debug,
      message,
      data,
    });
  }
}

export function warn(message: string, data: {} = {}) {
  if (__DEV__) {
    console.warn(message, data);
  } else {
    Sentry.addBreadcrumb({
      category: 'log',
      level: Sentry.Severity.Warning,
      message,
      data,
    });
    Sentry.captureMessage(message, {
      level: Sentry.Severity.Warning,
      ...data,
    });
  }
}

export function error(message: string | Error, data: {} = {}) {
  if (__DEV__) {
    console.error(message, data);
  } else {
    if (typeof message === 'string') {
      Sentry.captureMessage(message, data);
    } else {
      Sentry.captureException(message, data);
    }
  }
}
