import * as Sentry from '@sentry/react-native';
// Chalk has both type and class with the same name
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Chalk } from 'chalk';

/**
 * Log system which provides a consistent interface for logging in both production and development,
 * exposing the logs as beautiful colorized text in development and as Sentry breadcrumbs in
 * production!
 */

// This is a hack to avoid printing undefined when data is not passed
const maybe = (data?: Record<string, unknown> | null) => (data ? [data] : []);

// Load chalk asynchronously to avoid bundling in production
// TODO: make sure chalk is loaded before we log (oops)
export let chalk: Chalk;
if (__DEV__) {
  import('chalk').then((c) => (chalk = new c.default.Instance({ level: 3 })));
}

export function log(message: string, data?: Record<string, unknown>) {
  if (__DEV__) {
    console.log(chalk`{grey.bold [LOG]} ${message}`, ...maybe(data));
  } else {
    Sentry.addBreadcrumb({
      category: 'log',
      level: 'log',
      message,
      data,
    });
  }
}

export function info(message: string, data?: Record<string, unknown>) {
  if (__DEV__) {
    console.info(chalk`{blueBright.bold [INFO]} ${message}`, ...maybe(data));
  } else {
    Sentry.addBreadcrumb({
      category: 'log',
      level: 'info',
      message,
      data,
    });
  }
}

export function debug(message: string, data?: Record<string, unknown>) {
  if (__DEV__) {
    console.debug(chalk`{green.bold [DEBUG]} ${message}`, ...maybe(data));
  } else {
    Sentry.addBreadcrumb({
      category: 'log',
      level: 'debug',
      message,
      data,
    });
  }
}

export function warn(message: string, data?: Record<string, unknown>) {
  if (__DEV__) {
    console.warn(chalk`{yellow.bold [WARN]} ${message}`, ...maybe(data));
  } else {
    Sentry.addBreadcrumb({
      category: 'log',
      level: 'warning',
      message,
      data,
    });
    Sentry.captureMessage(message, {
      level: 'warning',
      ...data,
    });
  }
}

export function error(message: string | Error, data?: Record<string, unknown>) {
  if (__DEV__) {
    console.error(chalk`{red.bold [ERROR]} ${message}`, ...maybe(data));
  } else {
    if (typeof message === 'string') {
      Sentry.captureMessage(message, data);
    } else {
      Sentry.captureException(message, data);
    }
  }
}
