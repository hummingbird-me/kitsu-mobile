import * as Sentry from 'sentry-expo';
import type { Chalk } from 'chalk';

// Get chalk asynchronously to avoid loading in production
export let chalk: Chalk;

// This is a hack to avoid printing undefined when data is not passed
const maybe = (data?: {}) => data ? [data] : [];

export function init() {
  if (__DEV__) {
    import('chalk').then(c => chalk = new c.default.Instance({ level: 3 }));
  } else {
    Sentry.init({
      dsn:
        'https://068b9ab849bf4485beb4884adcc5be83@o55600.ingest.sentry.io/200469',
      enableInExpoDevelopment: false,
      debug: true,
    });
  }
}

export function log(message: string, data?: {}) {
  if (__DEV__) {
    console.log(chalk`{grey.bold [LOG]} ${message}`, ...maybe(data));
  } else {
    Sentry.addBreadcrumb({
      category: 'log',
      level: Sentry.Severity.Log,
      message,
      data,
    });
  }
}

export function info(message: string, data?: {}) {
  if (__DEV__) {
    console.info(chalk`{blueBright.bold [INFO]} ${message}`, ...maybe(data));
  } else {
    Sentry.addBreadcrumb({
      category: 'log',
      level: Sentry.Severity.Info,
      message,
      data,
    });
  }
}

export function debug(message: string, data?: {}) {
  if (__DEV__) {
    console.debug(chalk`{green.bold [DEBUG]} ${message}`, ...maybe(data));
  } else {
    Sentry.addBreadcrumb({
      category: 'log',
      level: Sentry.Severity.Debug,
      message,
      data,
    });
  }
}

export function warn(message: string, data?: {}) {
  if (__DEV__) {
    console.debug(chalk`{yellow.bold [WARN]} ${message}`, ...maybe(data));
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

export function error(message: string | Error, data?: {}) {
  if (__DEV__) {
    console.debug(chalk`{red.bold [ERROR]} ${message}`, ...maybe(data));
  } else {
    if (typeof message === 'string') {
      Sentry.captureMessage(message, data);
    } else {
      Sentry.captureException(message, data);
    }
  }
}
